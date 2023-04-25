const mongoose = require("mongoose");
const {
  SENDING,
  APPROVED,
  REJECTED,
  ASSIGNED,
} = require("../constant/constant");
const schema = mongoose.Schema;

const requestSchema = new schema({
  idTopic: {
    type: schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  idSubject: {
    type: schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  idGroup: {
    type: schema.Types.ObjectId,
    ref: "Group",
  },
  status: {
    type: String,
    enum: [SENDING, APPROVED, REJECTED, ASSIGNED],
    default: SENDING,
  },
  plan: {
    type: String,
    default: "",
  },
  note: {
    type: String,
    default: "",
  },
  scheduledVersion: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

requestSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
