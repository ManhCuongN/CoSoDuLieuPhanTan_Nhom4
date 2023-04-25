const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("✅ Database was connected");
  })
  .catch((error) => {
    console.error(`❌ Failed with ${error}`);
  });

mongoose.connection.on("error", (err) => {
  throw err;
});
