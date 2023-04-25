const Subject = require("../model/subject");

const index = async () => {
  const subject = await Subject.find({ scheduled: true, closeStatus: true });

  if (subject && subject.length > 0) {
    for (let i = 0; i < subject.length; i++) {
      console.log(new Date(), subject[i].from, subject[i].to);
      const today = new Date().getTime();
      const from = subject[i].from.getTime();
      const to = subject[i].to.getTime();
      if (today >= from && today <= to) {
        subject[i].closeStatus = false;
        subject[i].scheduledVersion = subject[i].scheduledVersion + 1;

        console.log("Open subject:  ", subject[i].title);
        await subject[i].save();
      }
    }
  }
};

module.exports = index;
