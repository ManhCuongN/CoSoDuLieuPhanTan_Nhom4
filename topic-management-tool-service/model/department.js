const mongoose = require("mongoose");
const schema = mongoose.Schema;

const departmentSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
  },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
