const subjectServie = require("../service/subject");
const middleware = require("../security/authorization");

const express = require("express");
const router = express.Router();

router
  .route("/")
  .post(middleware.verifyManagerPermission, subjectServie.create);
router
  .route("/:idSubject")
  .put(middleware.verifyTeacherPermission, subjectServie.update)
  .get(middleware.verifyManagerPermission, subjectServie.getGenaralInfor);

router
  .route("/schedule/:idSubject")
  .post(middleware.verifyManagerPermission, subjectServie.createSchedule);
router
  .route("/schedule/add-students/:idSubject")
  .post(middleware.verifyManagerPermission, subjectServie.addStudentsToSubject);
router.route("/search").post(subjectServie.search);

module.exports = router;
