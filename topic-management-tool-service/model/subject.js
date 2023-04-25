const mongoose = require("mongoose");
const schema = mongoose.Schema;

const subjectSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  idUser: {
    type: schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalInvitation: {
    type: Number,
  },
  scheduledVersion: {
    type: Number,
    default: 0,
  },
  students: [
    {
      type: schema.Types.ObjectId,
      ref: "User",
    },
  ],
  limitRequest: {
    type: Number,
    required: true,
  },
  from: {
    type: Date,
  },
  to: {
    type: Date,
  },
  scheduled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  closeStatus: {
    type: Boolean,
    default: true,
  },
});

subjectSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
