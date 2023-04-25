const mongoose = require("mongoose");
const { STATUS_NEW, STATUS_SEEN } = require("../constant/eventConstant");
const schema = mongoose.Schema;

const eventSchema = new schema({
  objectId: {
    type: schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    requried: true,
  },
  status: {
    type: String,
    enum: [STATUS_NEW, STATUS_SEEN],
    default: STATUS_NEW,
  },
  createdAt: {
    type: Date,
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
