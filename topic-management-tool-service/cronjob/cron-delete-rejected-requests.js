const { REJECTED } = require("../constant/constant");
const Request = require("../model/request");

const index = async () => {
  const today = new Date();
  const rejectedRequests = await Request.find({ status: REJECTED });
  rejectedRequests.forEach((ele) => {
    const updatedAt = new Date(ele.updatedAt);
    if (today.getTime() - updatedAt.getTime() >= 5 * 24 * 60 * 60 * 1000) {
      console.log("Delete Requests :", ele);
      Request.findByIdAndDelete(ele._id);
    }
  });
};

module.exports = index;
