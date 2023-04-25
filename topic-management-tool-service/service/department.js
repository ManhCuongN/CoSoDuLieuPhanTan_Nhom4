const {
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT,
} = require("../constant/eventConstant");
const { CREATE_EVENT, UPDATE_EVENT } = require("../constant/eventType");
const { HTTP_CREATED_STATUS } = require("../constant/httpRequest");
const Department = require("../model/department");
const eventService = require("./event");
const create = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (title && title.trim() != "") {
      const department = new Department({
        title,
        createdAt: new Date(),
      });
      await department.save();
    }

    res.status(HTTP_CREATED_STATUS).json();

    eventService.createEvent(
      department._id,
      req.user._id,
      CREATE_EVENT,
      `${CREATE_DEPARTMENT}: ${department.title}`
    );
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

    const departments = await Department.find(searchData).populate("owner");
    res.status(200).json(departments);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { idDepartment } = req.params;
    const { owner, title } = req.body;
    if (owner != "") {
      await Department.findByIdAndUpdate(idDepartment, {
        owner,
        title,
      });
    } else {
      await Department.findByIdAndUpdate(idDepartment, {
        title,
      });
    }

    res.status(200).json();

    eventService.createEvent(
      idDepartment,
      req.user._id,
      UPDATE_EVENT,
      `${UPDATE_DEPARTMENT}: ${title}`
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { create, search, update };
