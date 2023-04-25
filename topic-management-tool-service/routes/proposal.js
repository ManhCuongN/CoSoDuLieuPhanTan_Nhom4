const proposalServie = require("../service/proposal");
const middleware = require("../security/authorization");

const express = require("express");
const router = express.Router();

router.route("/").post(proposalServie.create);

router.route("/search").post(proposalServie.search);

router
  .route("/:idProposal")
  .patch(middleware.verifyDeanOrHDPermission, proposalServie.action);
router
  .route("/:idProposal/add-note")
  .patch(middleware.verifyTeacherPermission, proposalServie.updateNote);

module.exports = router;
