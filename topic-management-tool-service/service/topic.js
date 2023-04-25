const { v4: uuidv4 } = require('uuid');

const {connectDB, sql} = require('../database/connection')
const {
  ROLE_TEACHER,
  ROLE_HD,
  ROLE_DEAN,
  APPROVED,
} = require("../constant/constant");
const { HTTP_CREATED_STATUS } = require("../constant/httpRequest");
const Topic = require("../model/topic");
const Subject = require("../model/subject");
const Request = require("../model/request");
const Department = require("../model/department");
const Group = require("../model/group");
const {
  OVER_REGISTER_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} = require("../constant/errorMessage");

const eventService = require("./event");
const {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
} = require("../constant/eventType");
const {
  CREATE_TOPIC,
  UPDATE_TOPIC,
  DELETE_TOPIC,
  ADD_NOTE,
  REGISTER_TOPIC,
} = require("../constant/eventConstant");
const User = require("../model/user");
const create = async (req, res, next) => {

  const server = {TT: "MCSR01", KHMT: 'MCSR02', KTMT: 'MCSR03' };
   
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
  let departmentCode;
  try {
    var {
      idSubject,
      title,
      description,
      filter,
      limit,
      numRequests,
      numMembers,
      numRegisters,
      requiredSkills,
      idGroup,
    } = req.body;
   console.log("filter", filter);
    console.log(idSubject);

    const createdBy = req.user._id;
    const createdBy2 = req.user._id;

    let ready = false;
    let confirm = false;
    let confirmSQL = 0;

    readySQL = 0

    if (req.user.role == ROLE_DEAN) {
      ready = true;
      readySQL = 1
      confirmSQL = 1;

    } else if (req.user.role == ROLE_HD) {
      readySQL = 1
    }
    const code = await generateCode(idSubject);
    const code2 = await generateCode(idSubject);
    console.log(code);


    //SQL
    //check
    if(filter == '63ff19d49580679f95c666ea') {
      filterSQL = "KHMT"
    } else if (filter == '63ff19e59580679f95c666ef') {
      filterSQL = "KTMT"
    } else {
      filterSQL = "Khac"
    }

    var sqlString = "SELECT * FROM DEPARTMENTS WHERE CODEDEPARTMENT = @filterSQL";
    const result = await new Promise((resolve, reject) => {
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
    console.log(result);
      const insertSql = `INSERT INTO TOPICS (CODETOPIC, CODESUBJECT, TITLE, DESCRIPTION, REQUIREDSKILLS, READY, CONFIRM, CREATEDBY,
      CODEINSTRUCTOR, FILTER, NUMBERREQUEST, NUMBERREGISTER, NUMBERMEMBERS, LIMIT, CODE)
       VALUES (@code, @idSubject, @title, @description, @requiredSkills,@readySQL,
       @confirmSQL, @createdBy, @createdBy2, @filterSQL, @numRequests, @numRegisters,
        @numMembers, @limit, @code2);`
    if(result == 'KHMT') {
      
      db2.request()
		.input('code', sql.NVarChar, code)
		.input('idSubject',sql.NVarChar, idSubject)
		.input('title', sql.NVarChar, title)
		.input('description', sql.NVarChar, description)
		.input('requiredSkills',sql.NVarChar, requiredSkills)
		.input('readySQL', sql.Int,readySQL)
		.input('confirmSQL', sql.Int,confirmSQL)
		.input('createdBy', sql.NVarChar,'103104376349733815179')
		.input('createdBy2', sql.NVarChar,'103104376349733815179')
		.input('filterSQL', sql.NVarChar,filterSQL)
		.input('numRequests', sql.Int,numRequests)
		.input('numRegisters', sql.Int,numRegisters)
		.input('numMembers', sql.Int,numMembers)
		.input('limit', sql.Int,limit)
		.input('code2', sql.NVarChar,code2)
    .query(insertSql, function(err, data){
        console.log(err, data)
      })
    } else if (result == 'KTMT') {
      db3.request()
      .input('code', sql.NVarChar, code)
      .input('idSubject',sql.NVarChar, idSubject)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('requiredSkills',sql.NVarChar, requiredSkills)
      .input('readySQL', sql.Int,readySQL)
      .input('confirmSQL', sql.Int,confirmSQL)
      .input('createdBy', sql.NVarChar,'103104376349733815179')
      .input('createdBy2', sql.NVarChar,'103104376349733815179')
      .input('filterSQL', sql.NVarChar,filterSQL)
      .input('numRequests', sql.Int,numRequests)
      .input('numRegisters', sql.Int,numRegisters)
      .input('numMembers', sql.Int,numMembers)
      .input('limit', sql.Int,limit)
      .input('code2', sql.NVarChar,code2)
      .query(insertSql, function(err, data){
          console.log(err, data)
        })
    } else {
      console.log('server khác');
    }
     
    
    const topic = new Topic({
      idSubject,
      title,
      numRequests,
      numMembers,
      ready,
      confirm,
      description,
      filter,
      limit,
      requiredSkills,
      code,
      createdBy,
      idTeacher: req.user._id,
      createdAt: new Date(),
    });
    await topic.save();

    if (idGroup != "") {
      Topic.findByIdAndUpdate(topic._id, {
        limit: topic.limit + 1,
        numRegisters: topic.numRegisters + 1,
      }).exec();
      const subject = await Subject.findById(topic.idSubject);
      let request = new Request({
        createdAt: new Date(),
        idTopic: topic._id,
        idSubject: topic.idSubject,
        idGroup,
        scheduledVersion: subject.scheduledVersion,
        plan: "",
        status: APPROVED,
      });
      await request.save();
      const group = await Group.findById(idGroup);
      group.idUsers.forEach((ele) => {
        eventService.createEvent(
          ele._id,
          ele._id,
          CREATE_EVENT,
          REGISTER_TOPIC
        );
      });
    }

    res.status(HTTP_CREATED_STATUS).json(topic);

    eventService.createEvent(
      req.user._id,
      req.user._id,
      CREATE_EVENT,
      `${CREATE_TOPIC} (${topic.title})`
    );

    const department = await Department.findById(filter);
    if (department && department.owner && !ready && !confirm) {
      const hd = await User.findById(department.owner);
      if (hd) {
        eventService.createEvent(
          hd._id,
          hd._id,
          CREATE_EVENT,
          `${req.user.displayName} đã tạo một đề tài mới: (${topic.title})`
        );
      }
    }
    if (!confirm) {
      const dean = await User.findOne({ role: ROLE_DEAN });
      if (dean) {
        eventService.createEvent(
          dean._id,
          dean._id,
          CREATE_EVENT,
          `${req.user.displayName} đã tạo một đề tài mới: (${topic.title})`
        );
      }
    }
  } catch (err) {
    console.log(err);
    // if (departmentTransaction && db2Trans) {
    //   await db2.rollback();
    // } else if(departmentTransaction && db3Trans) {
    //   await db3.rollback();

    // } else {
    //   console.log("rollback");
    // }
    // if (centerTransaction && db2Trans) {
    //   await centerDb.rollback();
    // } else if(centerTransaction && db3Trans) {
    //   await db3.rollback();
    // } else {
    //   console.log("rollback");
    // }
    next(err);
  } 
};

const createByImport = async (req, res, next) => {
  try {
    const { topics, idSubject } = req.body;

    topics.forEach(async (ele) => {
      const teacher = await User.findOne({ email: ele["SUPERVISOR"] });
      const department = await Department.findOne({ title: ele["MAJOR"] });
      if (!teacher || !department || !ele["CODE"]) {
        return;
      }
      const checkTopic = await Topic.findOne({ code: ele["CODE"] });
      if (checkTopic) {
        return;
      }
      const topic = new Topic({
        idSubject,
        title: ele["PROJECT NAME"],
        numRequests: ele["Number of registers"],
        numMembers: ele["Number of students"],
        description: ele["OBJECTIVE"],
        filter: department._id,
        limit: ele["Number of registers"],
        requiredSkills: ele["REQUIREMENT"],
        code: ele["CODE"],
        createdBy: req.user._id,
        idTeacher: teacher._id,
        createdAt: new Date(),
      });
      await topic.save();
    });

    res.status(HTTP_CREATED_STATUS).json();

    eventService.createEvent(
      req.user._id,
      req.user._id,
      CREATE_EVENT,
      `Bạn đã tải lên danh sách đề tài`
    );
  } catch (err) {
    console.log(err);
    
    next(err);
  }
};

const update = async (req, res, next) => {
const server = { KHMT: 'MCSR02', KTMT: 'MCSR03' };
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
  let departmentCode;
  let filterSQL;
   
  try {
    const { idTopicMo } = req.params;
    delete req.body["ready"];
    delete req.body["confirm"];
    const {idTopic, title, description,requiredSkills,filter,limit,numRequests,numMembers} = req.body
     console.log(idTopicMo);

    //SQL
    console.log(req.body.filter);
    if(req.body.filter == '63ff19d49580679f95c666ea') {
        filterSQL = "KHMT"
      } else if (req.body.filter == '63ff19e59580679f95c666ef') {
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
      const updateSql = `UPDATE TOPICS SET TITLE = @title, 
      DESCRIPTION = @description ,
      REQUIREDSKILLS = @requiredSkills,
      FILTER = @filterSQL,
      LIMIT = @limit,
      NUMBERREQUEST = @numRequests,
      NUMBERMEMBERS = @numMembers
      WHERE CODETOPIC = @idTopic`
    if(result == 'KHMT') {
         
      db2.request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('requiredSkills', sql.NVarChar, requiredSkills)
      .input('filterSQL', sql.NVarChar, filterSQL)
      .input('limit', sql.Int, limit)
      .input('numRequests', sql.Int, numRequests)
      .input('numMembers', sql.Int, numMembers)
      .input('idTopic', sql.NVarChar, idTopic)
      .query(updateSql, function(err, data){
        console.log(err, data)
      })

    }  else if (result == 'KTMT') {
       db3.request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('requiredSkills', sql.NVarChar, requiredSkills)
      .input('filterSQL', sql.NVarChar, filterSQL)
      .input('limit', sql.Int, limit)
      .input('numRequests', sql.Int, numRequests)
      .input('numMembers', sql.Int, numMembers)
      .input('idTopic', sql.NVarChar, idTopic)
      .query(updateSql, function(err, data){
        console.log(err, data)
      })
    }

    //Mongoose
    await Topic.findByIdAndUpdate(idTopicMo, req.body);
    eventService.createEvent(idTopicMo, req.user._id, UPDATE_EVENT, UPDATE_TOPIC);
    res.status(200).json();
  } catch (err) {
    console.log(err);
    next(err);
  }
};




const updateStatus = async (req, res, next) => {
  try {
    const { idTopic } = req.params;
    const { status } = req.body;
    let message = "";
    const topic = await Topic.findById(idTopic);
    if (req.user.role == ROLE_DEAN) {
      topic.confirm = status;
      if (status == true) {
        message = `Trưởng khoa ${req.user.displayName} đã duyệt đề tài (${topic.title})`;
      }
      eventService.createEvent(
        topic.idTeacher,
        topic.idTeacher,
        UPDATE_EVENT,
        message
      );
    } else if (req.user.role == ROLE_HD) {
      topic.ready = status;
      const user = await User.findOne({ role: ROLE_DEAN });
      if (user) {
        if (status == true) {
          message = `Trưởng bộ môn ${req.user.displayName} đã duyệt đề tài (${topic.title})`;
        }
        eventService.createEvent(user._id, user._id, UPDATE_EVENT, message);
      }
    }
    await topic.save();
    res.status(200).json();
    eventService.createEvent(idTopic, req.user._id, UPDATE_EVENT, ADD_NOTE);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const addNote = async (req, res, next) => {
  try {
    const { idTopic } = req.params;
    const { note } = req.body;
    const topic = await Topic.findById(idTopic);
    if (req.user.role == ROLE_DEAN) {
      topic.deanNote = note;
      eventService.createEvent(
        topic.idTeacher,
        topic.idTeacher,
        UPDATE_EVENT,
        `${req.user.displayName} đã thêm ghi chú mới cho đề tài (${topic.title})`
      );
    } else if (req.user.role == ROLE_HD) {
      topic.hdNote = note;
    }
    await topic.save();
    res.status(200).json();
    eventService.createEvent(idTopic, req.user._id, UPDATE_EVENT, ADD_NOTE);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const search = async (req, res, next) => {
  try {
    let searchData = req.body;
    if (!searchData || typeof searchData != "object") {
      searchData = {};
    }
    if (req.user.role == ROLE_HD) {
      const department = await Department.findOne({ owner: req.user._id });
      if (department) {
        searchData = { ...searchData, filter: department._id };
      }
    } else if (req.user.role == ROLE_TEACHER) {
      searchData = { ...searchData, idTeacher: req.user._id };
    }

    const topics = await Topic.find(searchData)
      .populate("idTeacher")
      .populate("filter")
      .populate("idSubject");
      console.log(topics);
    res.status(200).json(topics);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteTopic = async (req, res, next) => {
  var idTopic = req.params.idTopicMo;
  const server = { KHMT: 'MCSR02', KTMT: 'MCSR03' };
  var db;
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
  var filterTopic
  var filterSQL
  try {
    const topic = await Topic.findById(idTopic);
    var codeTopic = topic.code
    //SQL
    filterTopic = topic.filter
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
      const sqlDelete = `DELETE FROM TOPICS WHERE CODETOPIC = '${codeTopic}'`;
      if(result == 'KHMT') {
        db2.request()
        .query(sqlDelete, function(err, data){
          console.log(err, data)
        })
      } else if(result == 'KTMT') {
        db3.request()
        .query(sqlDelete, function(err, data){
          console.log(err, data)
        })
      }
  
   
     
    // await db2.query(sql2);
     //moongo
     await Topic.findByIdAndDelete({_id: idTopic})
 
    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
 } 
 finally {
    
  }
  
  

  
};

const generateCode = async (idSubject) => {
  const subject = await Subject.findById(idSubject);
  let index = 1;
  const topic = await Topic.findOne({ idSubject }).sort({ createdAt: -1 });
  if (topic) {
    const code = topic.code;
    index = Number(code.split(".")[1]) + 1;
  }
  if (subject) {
    const titles = subject.title.split(/\s+/);
    return `${titles[0].charAt(0).toUpperCase()}${titles[titles.length - 1]
      .charAt(0)
      .toUpperCase()}.${index}`;
  } else {
    return "None";
  }
};

module.exports = {
  create,
  update,
  search,
  deleteTopic,
  addNote,
  updateStatus,
  createByImport,
};
