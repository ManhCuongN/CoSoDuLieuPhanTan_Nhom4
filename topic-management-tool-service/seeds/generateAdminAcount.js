const { ROLE_ADMIN } = require("../constant/constant");
const User = require("../model/user");

const run = async () => {
  //admin

  try {
    console.log("Checking create admin account");
    let admin = await User.findOne({ googleId: "admin" });
    if (!admin) {
      admin = new User({
        givenName: "ADMIN",
        googleId: "admin",
        familyName: "TOPIC",
        role: ROLE_ADMIN,
        picture: "https://cdn.quasar.dev/img/boy-avatar.png",
        email: "admin@topicmanagementtool.com",
        type: "ACCOUNT",
      });

      await admin.save();
    }
  } catch (err) {
    console.log("admin user is existed");
  }
};

module.exports = {
  run,
};
