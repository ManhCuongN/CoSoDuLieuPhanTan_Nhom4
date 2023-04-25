const mongoose = require("mongoose");
const schema = mongoose.Schema;

const groupSchema = new schema({
  idUsers: [
    {
      type: schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  name: {
    type: String,
    requried: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});
groupSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
