const mongoose = require("mongoose");
const schema = mongoose.Schema;

const subjectQueueSchema = new schema({
  idSubject: {
    type: schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  from: {
    type: Date,
  },
  to: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
});

const SubjectQueue = mongoose.model("SubjectQueue", subjectQueueSchema);
module.exports = SubjectQueue;
