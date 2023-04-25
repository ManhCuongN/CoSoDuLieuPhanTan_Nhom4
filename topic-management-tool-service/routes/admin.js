const adminService = require("../service/admin");

const express = require("express");
const router = express.Router();

router.route("/").post(adminService.login);

module.exports = router;
