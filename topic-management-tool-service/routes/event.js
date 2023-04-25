const eventService = require("../service/event");

const express = require("express");
const router = express.Router();

router.route("/search").post(eventService.search);

router.route("/read").post(eventService.readAll);

module.exports = router;
