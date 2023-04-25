const { STATUS_SEEN } = require("../constant/eventConstant");
const Event = require("../model/event");

const createEvent = (objectId, userId, eventType, description) => {
  const event = new Event({
    objectId,
    userId,
    eventType,
    description,
    createdAt: new Date(),
  });
  event.save();
};

const search = async (req, res, next) => {
  try {
    const searchData = req.body;

    if (!searchData || typeof searchData != "object") {
      searchData = {};
    }
    const events = await Event.find(searchData)
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("userId");
    res.status(200).json(events);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const readAll = async (req, res, next) => {
  try {
    const events = await Event.find({ userId: req.user._id });
    events.forEach((ele) => {
      ele.status = STATUS_SEEN;
      ele.save();
    });
    res.status(200).json({});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { createEvent, search, readAll };
