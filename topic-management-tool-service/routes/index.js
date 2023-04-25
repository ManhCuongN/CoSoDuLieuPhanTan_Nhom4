const googleRoute = require("./google");
const userRoute = require("./user");
const passport = require("../passport");
const adminRoute = require("./admin");
const subjectRoute = require("./subject");
const topicRoute = require("./topic");
const requestRoute = require("./request");
const proposalRoute = require("./proposal");
const groupRoute = require("./group");
const eventRoute = require("./event");
const departmentRoute = require("./department");
const configRoute = (app) => {
  app.get("/", (req, res) => {
    res.send("hello");
  });
  app.use("/auth/google", googleRoute);
  app.use("/auth/admin", adminRoute);
  app.use(passport.authenticate("jwt", { session: false }));

  app.use("/user/api", userRoute);
  app.use("/request/api", requestRoute);
  app.use("/subject/api", subjectRoute);
  app.use("/topic/api", topicRoute);
  app.use("/proposal/api", proposalRoute);
  app.use("/group/api", groupRoute);
  app.use("/event/api", eventRoute);
  app.use("/department/api", departmentRoute);
  app.use((err, req, res, next) => {
    if (!err.status) {
      err.status = 500;
    }
    res.status(err.status).json({ error: err.message });
  });
};

module.exports = configRoute;
