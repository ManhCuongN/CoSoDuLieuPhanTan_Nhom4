const { ROLE_STUDENT } = require("../constant/constant");
const {
  CREATE_GROUP,
  INVITE_GROUP,
  UPDATE_GROUP,
  UPDATE_GROUP_BY_OTHERS,
} = require("../constant/eventConstant");
const { CREATE_EVENT, UPDATE_EVENT } = require("../constant/eventType");
const { HTTP_CREATED_STATUS } = require("../constant/httpRequest");
const Group = require("../model/group");
const eventService = require("./event");
const create = async (req, res, next) => {
  try {
    const { name, idUsers } = req.body;
    if (idUsers && Array.isArray(idUsers)) {
      idUsers.push(req.user._id);

      const group = new Group({
        name,
        idUsers: [...new Set(idUsers)],
        createdAt: new Date(),
      });
      await group.save();

      eventService.createEvent(
        group._id,
        req.user._id,
        CREATE_EVENT,
        `${CREATE_GROUP}: (${group.title})`
      );
      idUsers.forEach((ele) => {
        if (ele != req.user._id) {
          eventService.createEvent(
            group._id,
            ele,
            CREATE_EVENT,
            `${INVITE_GROUP}: (${group.title})`
          );
        }
      });
    }
    res.status(HTTP_CREATED_STATUS).json();
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
      searchData.idUsers = req.user._id;
    }
    const groups = await Group.find(searchData).populate("idUsers");
    res.status(200).json(groups);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { idGroup } = req.params;
    const { newName } = req.body;

    const group = await Group.findByIdAndUpdate(idGroup, {
      name: newName,
    });
    res.status(200).json();

    eventService.createEvent(
      group._id,
      req.user._id,
      UPDATE_EVENT,
      UPDATE_GROUP
    );
    const idUsers = group.idUsers;
    idUsers.forEach((ele) => {
      if (ele != req.user._id) {
        eventService.createEvent(
          group._id,
          ele,
          UPDATE_EVENT,
          `${UPDATE_GROUP_BY_OTHERS} (${group.name})`
        );
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, search, update };
