const userService = require("../service/user");
const middleware = require("../security/authorization");
const multer = require('multer');
const express = require("express");
const router = express.Router();


const upload = multer({
  storage: multer.memoryStorage()
})

router.route("/").get(userService.get).put(userService.update);
router.route("/search").post(userService.search);
router
  .route("/:idUser")
  .delete(middleware.verifyAdminPermission, userService.deleteUser);

router.route("/update").put(userService.update);
router
  .route("/add-role/:idUser")
  .put(middleware.verifyAdminPermission, userService.addRole);

router.route("/student/upload").post(upload.single("file2"),userService.studentUpload)
router.route("/student/submit").post(userService.studentSubmit)
router.route("/student/result/khmt").get(userService.resultKHMT)
router.route("/student/result/ktmt").get(userService.resultKTMT)

router.route("/student/result/updateStatus").put(userService.updateStatus)



  

module.exports = router;
