const googleService = require("../service/authentication/google");

const express = require("express");
const passport = require("../passport");
const router = express.Router();

router
  .route("/")
  .post(
    passport.authenticate("google-token", { session: false }),
    googleService.googleAuthentication
  );

router.route("/admin").post();

router.route("/refresh").post(googleService.refreshAccessToken);

module.exports = router;
