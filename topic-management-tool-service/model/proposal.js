const mongoose = require("mongoose");
const schema = mongoose.Schema;

const {
  SENDING,
  APPROVED,
  REJECTED,
  ASSIGNED,
} = require("../constant/constant");

const proposalSchema = new schema({
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
    default: "",
  },
  requiredSkills: {
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
  plan: {
    type: String,
    default: "",
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
  idGroup: {
    type: schema.Types.ObjectId,
    ref: "Group",
  },
  status: {
    type: String,
    enum: [SENDING, APPROVED, REJECTED, ASSIGNED],
    default: SENDING,
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
proposalSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const Proposal = mongoose.model("Proposal", proposalSchema);
module.exports = Proposal;
