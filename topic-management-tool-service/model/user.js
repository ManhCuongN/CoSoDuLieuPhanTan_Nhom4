const mongoose = require("mongoose");

const schema = mongoose.Schema;
const {
  SOFTWARE_ENGINEERING,
  COMMUNICATIONS_AND_COMPUTER_NETWORKs,
  COMPUTER_SCIENCE,
} = require("../constant/mayjorTDTU");

const userSchema = new schema({
  googleId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    default: "",
  },
  skills: {
    type: String,
    default: "",
  },
  class: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  picture: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  role: {
    type: String,
    required: true,
  },
});
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });
userSchema.virtual("displayName").get(function () {
  return `${this.familyName} ${this.givenName}`;
});

userSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
