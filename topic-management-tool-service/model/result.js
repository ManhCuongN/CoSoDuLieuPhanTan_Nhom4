const mongoose = require("mongoose");

const schema = mongoose.Schema;
const {
  SOFTWARE_ENGINEERING,
  COMMUNICATIONS_AND_COMPUTER_NETWORKs,
  COMPUTER_SCIENCE,
} = require("../constant/mayjorTDTU");

const resultSchema = new schema({
  idGroup: {
    type: String
  },
  idUser: {
    type: schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  docxReport: {
    type: String,
    required: true,
  },
  nameFileReport: {
    type: String
  },
  nameFileSource: {
    type: String
  },
  sourceCode: {
    type: String,
    required: true,
  },
  filter: {
    type: schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  isProtected: {
     type: Boolean,
     default: false
  }
  ,
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
 
});
resultSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const User = mongoose.model("Result", resultSchema);
module.exports = User;
