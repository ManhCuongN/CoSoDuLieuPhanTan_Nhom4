const Topic = require("../model/topic");
const Request = require("../model/request");
const { APPROVED } = require("../constant/constant");

const index = async () => {
  const topics = await Topic.find();

  if (topics && topics.length > 0) {
    for (let i = 0; i < topics.length; i++) {
      const requests = await Request.find({
        idTopic: topics[i]._id,
        status: APPROVED,
      });
      console.log("update number of register topic:  ", topics[i].title);
      topics[i].numRegisters = requests.length;
      await topics[i].save();
    }
  }
};

module.exports = index;
