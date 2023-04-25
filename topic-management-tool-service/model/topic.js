const mongoose = require("mongoose");
const schema = mongoose.Schema;

const topicSchema = new schema({
  idSubject: {
    type: schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  requiredSkills: {
    type: String,
    default: "",
  },
  deanNote: {
    type: String,
    default: "",
  },
  hdNote: {
    type: String,
    default: "",
  },
  ready: {
    type: Boolean,
    default: false,
  },

  confirm: {
    type: Boolean,
    default: false,
  },
  idTeacher: {
    type: schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdBy: {
    type: schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filter: {
    type: schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  numRequests: {
    type: Number,
    required: true,
  },
  numRegisters: {
    type: Number,
    default: 0,
  },
  numMembers: {
    type: Number,
  },
  limit: {
    type: Number,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

topicSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
