const departmentService = require("../service/department");
const middleware = require("../security/authorization");
const express = require("express");
const router = express.Router();

router.route("/").post(departmentService.create);

router.route("/search").post(departmentService.search);

router
  .route("/:idDepartment")
  .put(middleware.verifyAdminPermission, departmentService.update);

module.exports = router;
