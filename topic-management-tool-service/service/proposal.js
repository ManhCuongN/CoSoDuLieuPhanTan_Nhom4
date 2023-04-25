const {
  APPROVED,
  ROLE_TEACHER,
  ROLE_STUDENT,
  ROLE_HD,
  ROLE_DEAN,
  REJECTED,
} = require("../constant/constant");
const { HTTP_CREATED_STATUS } = require("../constant/httpRequest");
const Proposal = require("../model/proposal");
const Topic = require("../model/topic");
const Request = require("../model/request");
const Group = require("../model/group");
const User = require("../model/user");
const Department = require("../model/department");
const Subject = require("../model/subject");
const eventService = require("./event");
const {
  CREATE_PROPOSAL,
  REJECT_PROPOSAL,
  APPROVE_PROPOSAL,
} = require("../constant/eventConstant");
const { CREATE_EVENT, UPDATE_EVENT } = require("../constant/eventType");
const create = async (req, res, next) => {
  try {
    const {
      idSubject,
      title,
      description,
      requiredSkills,
      idTeacher,
      plan,
      filter,
      idGroup,
    } = req.body;

    const teacher = await User.findById(idTeacher);
    if (teacher && teacher.role == ROLE_TEACHER) {
      const subject = await Subject.findById(idSubject);
      const createdBy = req.user._id;
      const proposal = new Proposal({
        idSubject,
        title,
        description,
        filter,
        plan,
        requiredSkills,
        createdBy,
        idTeacher: teacher._id,
        createdAt: new Date(),
        idGroup,
        scheduledVersion: subject.scheduledVersion,
      });
      await proposal.save();
      eventService.createEvent(
        proposal._id,
        req.user._id,
        CREATE_EVENT,
        CREATE_PROPOSAL
      );
      res.status(HTTP_CREATED_STATUS).json(proposal);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const search = async (req, res, next) => {
  try {
    let skip = false;
    let searchData = req.body;
    if (!searchData || typeof searchData != "object") {
      searchData = {};
    }

    if (req.user.role == ROLE_HD) {
      const department = await Department.findOne({ owner: req.user._id });
      if (department && department._id != "") {
        searchData = { ...searchData, filter: department._id };
      } else {
        skip = true;
      }
    } else if (req.user.role == ROLE_STUDENT) {
      searchData = { ...searchData, createdBy: req.user._id };
    } else if (req.user.role == ROLE_DEAN) {
      searchData = { ...searchData, ready: true };
    }
    if (skip == false) {
      let proposals = await Proposal.find(searchData)
        .populate("idTeacher")
        .populate("filter")
        .populate({
          path: "idGroup",
          populate: { path: "idUsers" },
        })
        .populate("idSubject");

      res.status(200).json(proposals);
    } else {
      res.status(200).json([]);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const action = async (req, res, next) => {
  try {
    const { action, note, idTeacher } = req.body;
    const { idProposal } = req.params;
    if (idProposal && idTeacher != "") {
      const proposal = await Proposal.findById(idProposal);
      const group = await Group.findById(proposal.idGroup);
      const idUsers = group.idUsers;

      if (proposal) {
        if (action == false) {
          proposal.status = REJECTED;
          idUsers.forEach((ele) => {
            eventService.createEvent(
              proposal._id,
              ele,
              UPDATE_EVENT,
              REJECT_PROPOSAL
            );
          });
        }
        if (req.user.role == ROLE_HD) {
          proposal.ready = action;
          proposal.note = note;
        } else if (req.user.role == ROLE_DEAN) {
          proposal.confirm = action;
          proposal.note = note;
          if (action == true) {
            proposal.status = APPROVED;
            idUsers.forEach((ele) => {
              eventService.createEvent(
                proposal._id,
                ele,
                UPDATE_EVENT,
                APPROVE_PROPOSAL
              );
            });
            createNewTopicForProposal(proposal);
          }
        }
        proposal.idTeacher = idTeacher;
      }
      await proposal.save();
      res.status(200).json();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { idProposal } = req.params;
    const { note } = req.body;

    if (idProposal && note.trim() != "") {
      const proposal = await Proposal.findById(idProposal);
      proposal.note = note;
      await proposal.save();
    }
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

const createNewTopicForProposal = async (proposal) => {
  try {
    const group = await Group.findById(proposal.idGroup);
    const code = await generateCode(proposal.idSubject);
    const topic = new Topic({
      idSubject: proposal.idSubject,
      title: proposal.title,
      description: proposal.description,
      requiredSkills: proposal.requiredSkills,
      ready: true,
      confirm: true,
      idTeacher: proposal.idTeacher,
      createdBy: proposal.createdBy,
      filter: proposal.filter,
      numRequests: 1,
      numRegisters: 1,
      numMembers: group.idUsers.length,
      limit: 1,
      createdAt: new Date(),
      code: code,
    });

    await topic.save();
    const request = new Request({
      idTopic: topic._id,
      idSubject: topic.idSubject,
      idGroup: group._id,
      status: APPROVED,
      plan: proposal.plan,
      note: proposal.note,
      scheduledVersion: proposal.scheduledVersion,
      createdAt: new Date(),
    });
    request.save();
  } catch (err) {
    throw err;
  }
};

const generateCode = async (idSubject) => {
  const subject = await Subject.findById(idSubject);
  let index = 1;
  const topic = await Topic.findOne({ idSubject }).sort({ createdAt: -1 });
  if (topic) {
    const code = topic.code;
    index = Number(code.split(".")[1]) + 1;
  }
  if (subject) {
    const titles = subject.title.split(/\s+/);
    return `${titles[0].charAt(0).toUpperCase()}${titles[titles.length - 1]
      .charAt(0)
      .toUpperCase()}.${index}`;
  } else {
    return "None";
  }
};

module.exports = { create, search, action, updateNote };
