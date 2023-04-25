require("dotenv").config();
require("./mongoose");
require("./database/connection");



const seeds = require("./seeds/generateAdminAcount");

const express = require("express");
const bodyParse = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./utils/serviceAccountKey.json');
const app = express();
const redis = require('redis');
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});






// Khởi tạo Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'csdlpt-a94b8.appspot.com',
// });

app.use(morgan("common"));
app.use(bodyParse.json());
app.use(cors(corsOptions));

require("./routes/index")(app);

app.get("/", (req, res) => {
  res.end("Welcome to Topic Management Tool API");
});



// Xử lý yêu cầu đăng ký từ client
app.post('/register', (req, res) => {
  redisClient.on('message', (channel, message) => {
    console.log("abc");
    console.log(`Received message: ${message} on channel ${channel}`);
  
    // Lấy thông tin khoa từ Redis
    redisClient.hget('departments', message, (err, reply) => {
      console.log("abc");
      if (err) {
        console.error(`Error getting department for ${message}: ${err}`);
      } else {
        const department = JSON.parse(reply);
      console.log("D", department);
        // Xác định server để lưu thông tin
        let server;
        if (department.name === 'Khoa C') {
          server = 'serverA';
        } else if (department.name === 'Khoa D') {
          server = 'serverB';
        } else {
          console.error(`Invalid department: ${department.name}`);
          return;
        }
  
        // Lưu thông tin vào CSDL trên server tương ứng
        // ...
      }
    });
  });
  
  // Đăng ký theo dõi kênh "registration"
  redisClient.subscribe('registration');
  
  
});

//seeds
seeds.run();

// require("./seeds/generateStudentAccount").run();

//Cronjob
require("./cronjob/index").start();

// require("./cronjob/cron-open-subject-when-reach")();
// require("./cronjob/cron-adjust-number-of-register-topics")();
app.listen(port, () => {
  console.log(`✅ Server is listening at port: ${port}`);
});
