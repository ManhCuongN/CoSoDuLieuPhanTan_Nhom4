const { HTTP_CREATED_STATUS } = require("../constant/httpRequest");
const Subject = require("../model/subject");
const Topic = require("../model/topic");
const Request = require("../model/request");
const User = require("../model/user");
const SubjectQueue = require("../model/subjectQueue");
const eventService = require("./event");
const { CREATE_EVENT, UPDATE_EVENT } = require("../constant/eventType");
const {
  CREATE_SUBJECT,
  CREATE_SCHEDULE,
  UPDATE_SUBJECT,
  UPDATE_SCHEDULE,
  INVITE_SUBJECT,
} = require("../constant/eventConstant");
const { APPROVED } = require("../constant/constant");
const create = async (req, res, next) => {
  try {
    const { title, limitRequest } = req.body;
    const idUser = req.user._id;
    const subject = new Subject({
      title,
      limitRequest,
      idUser,
      createdAt: new Date(),
    });
    await subject.save();
    res.status(HTTP_CREATED_STATUS).json(subject);
    eventService.createEvent(
      subject._id,
      req.user._id,
      CREATE_EVENT,
      `${CREATE_SUBJECT}: ${subject.title}`
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { idSubject } = req.params;
    const { title, from, to, closeStatus, limitRequest } = req.body;

    await Subject.findByIdAndUpdate(idSubject, {
      title,
      from: new Date(from),
      owner: req.user._id,
      to: new Date(to),
      limitRequest,
      closeStatus,
      createdAt: new Date(),
    });
    res.status(200).json();
    eventService.createEvent(
      subject._id,
      req.user._id,
      CREATE_EVENT,
      `${UPDATE_SUBJECT}: ${subject.title}`
    );
  } catch (err) {
    next(err);
  }
};

const search = async (req, res, next) => {
  try {
    const searchData = req.body;

    if (!searchData || typeof searchData != "object") {
      searchData = {};
    }
    const subjects = await Subject.find(searchData);
    res.status(200).json(subjects);
  } catch (err) {
    next(err);
  }
};

const getGenaralInfor = async (req, res, next) => {
  try {
    const { idSubject } = req.params;

    if (idSubject && idSubject != "") {
      let data = [];
      const requests = await Request.find({
        idSubject: idSubject,
        status: APPROVED,
      })
        .populate({ path: "idTopic", populate: { path: "idTeacher" } })
        .populate("idSubject")
        .populate({ path: "idGroup", populate: { path: "idUsers" } });
      if (requests != null) {
        let index = 1;
        requests.forEach((ele) => {
          const object = {};
          object["STT"] = index;
          object["Mã đề tài"] = ele.idTopic.code;
          object["Giảng viên"] = ele.idTopic.idTeacher.displayName;
          object["Tên đề tài"] = ele.idTopic.title;
          object["Đợt đăng ký"] = ele.scheduledVersion;
          object["Ghi chú"] = ele.note;
          const students = ele.idGroup.idUsers;
          for (let i = 0; i < students.length; i++) {
            const name = `Họ và tên sinh viên ${i + 1}`;
            const mssv = `MSSV (SV ${i + 1})`;
            object[name] = students[i].displayName;
            object[mssv] = students[i].email.split("@")[0];
          }
          data.push(object);
          index++;
        });
      }
      res.status(200).json(data);
    } else {
      res.status(404).json();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const createSchedule = async (req, res, next) => {
  try {
    const { idSubject } = req.params;
    const { from, to, idUsers, emails } = req.body;
    await Subject.findByIdAndUpdate(idSubject, {
      from: new Date(from),
      to: new Date(to),
      students: idUsers,
      scheduled: true,
    });
    const subject = await Subject.findById(idSubject).populate("students");

    const emailStudents = subject.students.map((ele) => ele.email);

    let numQueue = 0;
    for (let i = 0; i < emails.length; i++) {
      const lowerEmail = emails[i].toLowerCase();
      const user = await User.findOne({ email: lowerEmail });

      if (user) {
        if (emailStudents.indexOf(user.email) == -1) {
          subject.students.push(user._id);
        }
      } else {
        numQueue++;
        const subjectQueue = new SubjectQueue({
          idSubject: idSubject,
          email: lowerEmail,
          from: new Date(from),
          to: new Date(to),
          createdAt: new Date(),
        });
        subjectQueue.save();
      }
    }

    subject.totalInvitation = subject.students.length + numQueue;
    await subject.save();
    res.status(200).json();
    eventService.createEvent(
      idSubject,
      req.user._id,
      CREATE_EVENT,
      `${CREATE_SCHEDULE} (${subject.title})`
    );
    subject.students.forEach((ele) => {
      eventService.createEvent(
        idSubject,
        ele._id,
        UPDATE_EVENT,
        `${INVITE_SUBJECT} (${subject.title})`
      );
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const addStudentsToSubject = async (req, res, next) => {
  try {
    const { idSubject } = req.params;
    const { idUsers } = req.body;
    const subject = await Subject.findById(idSubject);
    subject.students.push(...idUsers);
    subject.totalInvitation = subject.totalInvitation + idUsers.length;
    await subject.save();

    res.status(200).json();
    eventService.createEvent(
      idSubject,
      req.user._id,
      UPDATE_EVENT,
      `${UPDATE_SCHEDULE} (${subject.title})`
    );
    idUsers.forEach((ele) => {
      eventService.createEvent(
        idSubject,
        ele,
        UPDATE_EVENT,
        `${INVITE_SUBJECT} (${subject.title})`
      );
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  create,
  update,
  search,
  getGenaralInfor,
  createSchedule,
  addStudentsToSubject,
};
