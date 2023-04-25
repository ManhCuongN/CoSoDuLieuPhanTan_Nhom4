const Group = require("../model/group");
const Request = require("../model/request");
const Subject = require("../model/subject");
const User = require("../model/user");
const Result = require("../model/result")
const Proposal = require("../model/proposal");
const { removeStrictFields } = require("../utils/userUtil");
const Event = require("../model/event");
const { ROLE_STUDENT } = require("../constant/constant");
const { async } = require("@firebase/util");
const admin = require('firebase-admin');
const serviceAccount = require('./../utils/serviceAccountKey.json');
const Department = require("../model/department");
const { connectDB,sql } = require("../database/connection");
// Khởi tạo Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://test-9681a.appspot.com',
});


const get = (req, res, next) => {
  res.status(200).json(req.user);
};

const studentUpload = async (req, res, next) => {
  try {
    const file = req.file
    console.log(file);
    // const userId = (req.user._id)
    // const resultGroup = await Group.findOne({idUser: req.user._id})
    // const groupId = (resultGroup._id);
   // Lưu file vào Firebase Storage
    const bucket = admin.storage().bucket();
    const fileName = Date.now() + '_' + file.originalname;
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    stream.end(file.buffer);
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

   // Trả về URL của file đã được lưu trên Firebase Storage
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      fileUpload.name
    )}`;
    console.log(url);
    res.json({"url": url, "originalName": file.originalname});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const studentSubmit = async(req,res,next) =>  {
   
    const server = { KHMT: 'MCSR02', KTMT: 'MCSR03' };
    var filterSQL;
    try {
      var [db1, db2, db3] = await Promise.all([
        connectDB('MCSR01'),
        connectDB('MCSR02'),
        connectDB('MCSR03'),

      ]);
      console.log('Connected to all servers');
      // Your code to query the databases goes here
    } catch (err) {
      console.log('Error connecting to databases', err);
    }
    try {
    const a =  await User.findOne({_id: req.user._id})
    const userId = a.googleId
   console.log("userId", userId);
    const groupId = await Group.findOne({idUser: userId })
    var nameGroup = groupId.name
    var idGroup = groupId._id.toString();
    console.log("id", idGroup);
    
    const docxReport = req.body.report
    const sourceCode = req.body.source
    const nameFileReport = req.body.nameFileReport
    const nameFileSource = req.body.nameFileSource
    const topicFilter = await Department.findOne({title: req.body.topicFilter})
    var filter = topicFilter._id
    //SQL
    if(filter == '63ff19d49580679f95c666ea') {
      filterSQL = "KHMT"
    } else if (filter == '63ff19e59580679f95c666ef') {
      filterSQL = "KTMT"
    } else {
      filterSQL = "Khac"
    }
    //Mongoose
    const result = new Result({
      idGroup: nameGroup,
      idUser: req.user._id,
      docxReport,
      nameFileReport,
      nameFileSource,
      sourceCode,
      filter: topicFilter
    })
    await result.save()

    var sqlString = "SELECT * FROM DEPARTMENTS WHERE CODEDEPARTMENT = @filterSQL";
    const resultCheck = await new Promise((resolve, reject) => {
      db1.request()
        .input("filterSQL", sql.NVarChar, filterSQL)
        .query(sqlString, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data.recordset[0].CODEDEPARTMENT);
          }
        });
    });
    // console.log(resultCheck);
    const insertSql = `
      INSERT INTO RESULTS (CODERESULTS, CODEGROUP,CODEACTOR, GROUPNAME, FILEREPORT, SOURCECODE, FILTER,ISPROTECTED,nameFilerReport, nameFilerSource )
      VALUES (@codeResult, @groupId, @userId, @nameGroup,@docxReport,@sourceCode,@topicFilter,@ISPROTECTED, @nameFileReport, @nameFileSource  )
      `
    if(resultCheck == 'KHMT') {
      console.log("idGroup", idGroup);
      db2.request()
      .input('codeResult', sql.NVarChar, result._id)
      .input('groupId', sql.NVarChar, idGroup)
      .input('userId', sql.NVarChar, userId)
      .input('nameGroup', sql.NVarChar, nameGroup)
      .input('docxReport', sql.NVarChar, docxReport)
      .input('sourceCode', sql.NVarChar, sourceCode)
      .input('topicFilter', sql.NVarChar, filterSQL)
      .input('ISPROTECTED', sql.Int, 0)     
      .input('nameFileReport', sql.NVarChar, nameFileReport)
      .input('nameFileSource', sql.NVarChar, nameFileSource)

      
      
      .query(insertSql, function(err, data){
        console.log(err, data)
      })
    } else if(result == 'KTMT') {
      db3.request()
      .input('groupId', sql.NVarChar, idGroup)
      .input('userId', sql.NVarChar, userId)
      .input('nameGroup', sql.NVarChar, nameGroup)
      .input('docxReport', sql.NVarChar, docxReport)
      .input('sourceCode', sql.NVarChar, sourceCode)
      .input('topicFilter', sql.NVarChar, filterSQL)
      .input('nameFileReport', sql.NVarChar, nameFileReport)
      .input('nameFileSource', sql.NVarChar, nameFileSource)
      .query(insertSql, function(err, data){
        console.log(err, data)
      })
    }

    
    } catch (error) {
      console.log(error);
    }
   
   
}

const resultKHMT = async(req, res, next) => {
   try {
     const results = await Result.find({filter: "63ff19d49580679f95c666ea"})
     console.log(results);
      return  res.status(200).json(results);
    
   } catch (error) {
    next(error)
   }
}


const resultKTMT = async(req, res, next) => {
  try {
    const results = await Result.find({filter: "63ff19e59580679f95c666ef"})
    res.status(200).json(results);

   
  } catch (error) {
   next(error)
  }
}

const updateStatus = async(req,res,next) => {
  try {
    var [db1, db2, db3] = await Promise.all([
      connectDB('MCSR01'),
      connectDB('MCSR02'),
      connectDB('MCSR03')
    ]);
    console.log('Connected to all servers');
    // Your code to query the databases goes here
     } catch (err) {
    console.log('Error connecting to databases', err);
    }
   try {
    const statusCurrent = await Result.findOne({_id: req.body.id})
    
    let isProtected = statusCurrent.isProtected
    let isProMo = !isProtected
    
    filterTopic = statusCurrent.filter
    const update = await Result.findByIdAndUpdate({_id: req.body.id}, {isProtected: isProMo}, {new: true})
    if(filterTopic == '63ff19d49580679f95c666ea') {
        filterSQL = "KHMT"
      } else if (filterTopic == '63ff19e59580679f95c666ef') {
        filterSQL = "KTMT"
      } else {
        filterSQL = "Khac"
      }
      var sqlString = "SELECT * FROM DEPARTMENTS WHERE CODEDEPARTMENT = @filter";
      const result = await new Promise((resolve, reject) => {
        db1.request()
          .input("filter", sql.NVarChar, filterSQL)
          .query(sqlString, function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data.recordset[0].CODEDEPARTMENT);
            }
          });
      });
      const updateSql = `UPDATE RESULTS SET ISPROTECTED = @isProtected 
      WHERE CODERESULTS = @idResult`
    if(result == 'KHMT') {
      var sqlString2 = "SELECT * FROM RESULTS WHERE CODERESULTS = @filterResult";
      const result2 = await new Promise((resolve, reject) => {
        db1.request()
          .input("filterResult", sql.NVarChar, statusCurrent._id)
          .query(sqlString2, function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data.recordset[0].ISPROTECTED);
            }
          });
      });
      console.log(result2);
      var unIsProtec;
      if(result2 == false) {
        unIsProtec = '1'
      } else  {
          unIsProtec = '0'
      }
      db2.request()
      .input('isProtected', sql.NVarChar, unIsProtec)
      .input('idResult', sql.NVarChar, statusCurrent._id)
      .query(updateSql, function(err, data){
        console.log(err, data)
      })

    }  else if (result == 'KTMT') {
      var sqlString3 = "SELECT * FROM RESULTS WHERE CODERESULTS = @filterResult";
      const result3 = await new Promise((resolve, reject) => {
        db1.request()
          .input("filterResult", sql.NVarChar, statusCurrent._id)
          .query(sqlString3, function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data.recordset[0].ISPROTECTED);
            }
          });
      });
      var unIsProtec;
      if(result3 == false) {
        unIsProtec = '1'
      } else  {
          unIsProtec = '0'
      }
      db3.request()
      .input('isProtected', sql.NVarChar, unIsProtec)
      .input('idResult', sql.NVarChar, statusCurrent._id)
      .query(updateSql, function(err, data){
        console.log(err, data)
      })
    }
    
   } catch (error) {
    console.log(error);
    next(error)
   }
}



const update = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const updatedData = removeStrictFields(req.body);
    const updateUserData = removeStrictFields({
      ...user.toObject(),
      ...updatedData,
    });
    await User.findByIdAndUpdate(userId, updateUserData);
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

const addRole = async (req, res, next) => {
  try {
    const { idUser } = req.params;
    const { role } = req.body;
    console.log(role);
    await User.findByIdAndUpdate(idUser, { role });
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

const search = async (req, res, next) => {
  try {
    const searchData = req.body;
    if (!searchData || typeof searchData != "object") {
      searchData = {};
    }

    const users = await User.find(searchData);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { idUser } = req.params;
    if (idUser != "") {
      const user = await User.findById(idUser);
      console.log(user);
      if (user && user.role == ROLE_STUDENT) {
        await Subject.updateMany(
          { students: idUser },
          { $pull: { students: idUser } }
        ).exec();
        await Event.deleteMany({ userId: idUser }).exec();
        const groups = await Group.find({ idUsers: idUser });
        groups.forEach(async (ele) => {
          await Request.deleteMany({ idGroup: ele._id }).exec();
          await Proposal.deleteMany({ idGroup: ele._id }).exec();
          await Group.findByIdAndDelete(ele._id).exec();
        });
      }
      await User.deleteOne({ _id: idUser }).exec();
    }
    console.log("done");
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

module.exports = { get, update, search, addRole,resultKTMT, deleteUser, studentUpload, studentSubmit,updateStatus, resultKHMT};
