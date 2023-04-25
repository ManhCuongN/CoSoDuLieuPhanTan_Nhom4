const { REJECTED } = require("../constant/constant");
const Proposal = require("../model/proposal");

const index = async () => {
  const today = new Date();
  const rejectedProposals = await Proposal.find({ status: REJECTED });
  rejectedProposals.forEach((ele) => {
    const updatedAt = new Date(ele.updatedAt);
    if (today.getTime() - updatedAt.getTime() >= 5 * 24 * 60 * 60 * 1000) {
      console.log("Delete Proposal :", ele);
      Proposal.findByIdAndDelete(ele._id);
    }
  });
};

module.exports = index;
