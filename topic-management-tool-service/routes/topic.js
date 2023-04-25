const topicServie = require("../service/topic");
const middleware = require("../security/authorization");

const express = require("express");
const router = express.Router();

router
  .route("/")
  .post(topicServie.create);
router
  .route("/import")
  .post(middleware.verifyManagerPermission, topicServie.createByImport);

router
  .route("/:idTopicMo")
  .put(
    middleware.verifyDeanOrHDOrTeacherOrManagerPermission,
    topicServie.update
  )
  .patch(middleware.verifyDeanOrHDPermission, topicServie.addNote)
  .delete(middleware.verifyDeanOrHDOrTeacherOrManagerPermission, topicServie.deleteTopic);

router.route("/search").post(topicServie.search);

router
  .route("/update-status/:idTopic")
  .patch(middleware.verifyDeanOrHDPermission, topicServie.updateStatus);

module.exports = router;
