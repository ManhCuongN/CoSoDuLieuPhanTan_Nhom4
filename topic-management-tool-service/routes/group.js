const groupService = require("../service/group");

const express = require("express");
const router = express.Router();

router.route("/").post(groupService.create);
router.route("/:idGroup").patch(groupService.update);

router.route("/search").post(groupService.search);

module.exports = router;
