const requestServie = require("../service/request");
const middleware = require("../security/authorization");

const express = require("express");
const router = express.Router();

router.route("/create/:idTopic").post(requestServie.create);

router
  .route("/:idRequest")
  .patch(middleware.verifyTeacherPermission, requestServie.updateStatus);
router
  .route("/:idRequest/add-note")
  .patch(middleware.verifyTeacherPermission, requestServie.updateNote);
router.route("/search").post(requestServie.search);

module.exports = router;
