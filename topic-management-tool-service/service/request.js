const {
  APPROVED,
  ROLE_TEACHER,
  ROLE_STUDENT,
  REJECTED,
  SENDING,
} = require("../constant/constant");
const Request = require("../model/request");
const Group = require("../model/group");
const Topic = require("../model/topic");
const { OVER_REGISTER_MESSAGE } = require("../constant/errorMessage");
const { HTTP_CREATED_STATUS } = require("../constant/httpRequest");
const eventService = require("./event");
const { CREATE_EVENT, UPDATE_EVENT } = require("../constant/eventType");
const {
  REGISTER_TOPIC,
  APPROVE_REQUEST,
  REJECT_REQUEST,
} = require("../constant/eventConstant");
const Subject = require("../model/subject");

const create = async (req, res, next) => {
  try {
    const { idTopic } = req.params;
    const { idGroup, plan } = req.body;
    let error = {};
    let topic = await Topic.findById(idTopic);
    const subject = await Subject.findById(topic.idSubject);
    const requests = await Request.count({ idTopic: topic._id });
    if (topic && requests < topic.numRequests) {
      let request = new Request({
        createdAt: new Date(),
        idTopic: topic._id,
        idSubject: topic.idSubject,
        idGroup,
        scheduledVersion: subject.scheduledVersion,
        plan,
      });
      await request.save();
    } else {
      error.push({ topic: topic.title, ...OVER_REGISTER_MESSAGE });
    }
    const group = await Group.findById(idGroup);
    group.idUsers.forEach((ele) => {
      eventService.createEvent(ele._id, ele._id, CREATE_EVENT, REGISTER_TOPIC);
    });

    res.status(HTTP_CREATED_STATUS).json(error);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const search = async (req, res, next) => {
  try {
    const searchData = req.body;
    if (!searchData || typeof searchData != "object") {
      searchData = {};
    }
    if (req.user.role == ROLE_STUDENT) {
      const groups = (await Group.find({ idUsers: req.user._id })).map(
        (ele) => ele._id
      );
      searchData.idGroup = { $in: groups };
    }
    let requests = await Request.find(searchData)
      .populate({
        path: "idTopic",
        populate: {
          path: "idTeacher",
        },
      })
      .populate("idSubject")
      .populate("idGroup");

    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { idRequest } = req.params;
    const { status, note } = req.body;

    if (idRequest && status && note && note.trim() != "") {
      const request = await Request.findById(idRequest);
      const group = await Group.findById(request.idGroup);
      const idUsers = group.idUsers;

      if (status == APPROVED) {
        const topic = await Topic.findById(request.idTopic);
        if (topic.numRegisters >= topic.limit) {
          throw OVER_REGISTER_MESSAGE;
        }
        topic.numRegisters = topic.numRegisters + 1;
        if (topic.numRegisters == topic.limit) {
          const closeRequests = await Request.find({
            idTopic: request.idTopic,
            status: SENDING,
          });
          closeRequests.forEach((ele) => {
            ele.status = REJECTED;
            ele.note = "Đề tài đã đủ số lượng nhóm đăng ký";
            ele.save();
          });
        }
        await topic.save();

        const requests = await Request.find({
          idSubject: request.idSubject,
          idGroup: request.idGroup,
        });
        requests.forEach((ele) => {
          if (String(ele._id) != String(request._id)) {
            ele.status = REJECTED;
            ele.note = "Đã đăng ký thành công một đề tài khác";
            ele.save();
          }
        });
        idUsers.forEach((ele) => {
          eventService.createEvent(
            request._id,
            ele,
            UPDATE_EVENT,
            APPROVE_REQUEST
          );
        });
      } else if (status == REJECTED) {
        idUsers.forEach((ele) => {
          eventService.createEvent(
            request._id,
            ele,
            UPDATE_EVENT,
            REJECT_REQUEST
          );
        });
      }
      request.status = status;
      request.note = note;

      await request.save();
    }
    res.status(200).json();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { idRequest } = req.params;
    const { note } = req.body;

    if (idRequest && note.trim() != "") {
      const request = await Request.findById(idRequest);
      request.note = note;
      await request.save();
    }
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = { create, search, updateStatus, updateNote };
