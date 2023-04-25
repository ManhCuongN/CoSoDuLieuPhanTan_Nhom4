const Subject = require("../model/subject");

const index = async () => {
  const subject = await Subject.find({ scheduled: true });

  if (subject && subject.length > 0) {
    for (let i = 0; i < subject.length; i++) {
      const today = new Date().getTime();
      const from = subject[i].from.getTime();
      const to = subject[i].to.getTime();
      if (today < from || today > to) {
        subject[i].closeStatus = true;
        console.log("Close subject:  ", subject[i].title);
        await subject[i].save();
      }
    }
  }
};

module.exports = index;
