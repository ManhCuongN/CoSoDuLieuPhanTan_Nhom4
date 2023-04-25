const SubjectQueue = require("../model/subjectQueue");
const Subject = require("../model/subject");
const checkQueue = async (email, userId) => {
  const subjectQueues = await SubjectQueue.find({ email: email });
  const today = new Date();
  subjectQueues.forEach(async (ele) => {
    if (ele.to.getTime() >= today.getTime()) {
      const subject = await Subject.findById(ele.idSubject);
      subject.students.push(userId);
      await subject.save();
      SubjectQueue.findByIdAndDelete(ele._id);
    }
  });
};

module.exports = { checkQueue };
