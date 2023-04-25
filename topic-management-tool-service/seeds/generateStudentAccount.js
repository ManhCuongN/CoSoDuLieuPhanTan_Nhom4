const { ROLE_STUDENT } = require("../constant/constant");
const User = require("../model/user");

const run = async () => {
  //admin

  try {
    test1 = new User({
      givenName: "test1",
      googleId: "00000",
      familyName: "TOPIC",
      role: ROLE_STUDENT,
      picture: "https://cdn.quasar.dev/img/boy-avatar.png",
      email: "test1@topicmanagementtool.com",
    });
    test2 = new User({
      givenName: "test2",
      googleId: "00000",
      familyName: "TOPIC",
      role: ROLE_STUDENT,
      picture: "https://cdn.quasar.dev/img/boy-avatar.png",
      email: "test2@topicmanagementtool.com",
    });
    test3 = new User({
      givenName: "test3",
      googleId: "00000",
      familyName: "TOPIC",
      role: ROLE_STUDENT,
      picture: "https://cdn.quasar.dev/img/boy-avatar.png",
      email: "test3@topicmanagementtool.com",
    });
    test4 = new User({
      givenName: "test4",
      googleId: "00000",
      familyName: "TOPIC",
      role: ROLE_STUDENT,
      picture: "https://cdn.quasar.dev/img/boy-avatar.png",
      email: "test4@topicmanagementtool.com",
    });
    test5 = new User({
      givenName: "test5",
      googleId: "00000",
      familyName: "TOPIC",
      role: ROLE_STUDENT,
      picture: "https://cdn.quasar.dev/img/boy-avatar.png",
      email: "test5@topicmanagementtool.com",
    });

    await test1.save();
    await test2.save();
    await test3.save();
    await test4.save();
    await test5.save();
  } catch (err) {
    console.log("Can not create seeds");
  }
};

module.exports = {
  run,
};
