const CronJob = require("cron").CronJob;

const job = new CronJob(
  "0 0 * * *",
  function () {
    console.log("CRON JOB EXEC");
    require("./cron-delete-rejected-proposal")();
    require("./cron-delete-rejected-requests")();
    require("./cron-open-subject-when-reach")();
    require("./cron-close-subject-when-expired")();
    require("./cron-adjust-number-of-register-topics")();
  },
  null,
  true,
  "Asia/Ho_Chi_Minh"
);

module.exports = job;
