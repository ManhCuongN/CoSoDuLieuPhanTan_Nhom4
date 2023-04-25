var idTopic = req.params.idTopicMo;
const server = { KHMT: 'MCSR02', KTMT: 'MCSR03' };
var db;
try {
  await sequelize.transaction(async (t) => {
    var [db1, db2, db3] = await Promise.all([
      connectDB('MCSR01', { transaction: t }),
      connectDB('MCSR02', { transaction: t }),
      connectDB('MCSR03', { transaction: t })
    ]);
    console.log('Connected to all servers');
    
    // Your code to query the databases goes here
    const topic = await Topic.findById(idTopic, { transaction: t });
    var codeTopic = topic.code
    var filterTopic = topic.filter
    var filterSQL
    if(filterTopic == '63ff19d49580679f95c666ea') {
      filterSQL = "KHMT"
    } else if (filterTopic == '63ff19e59580679f95c666ef') {
      filterSQL = "KTMT"
    } else {
      filterSQL = "Khac"
    }
    var sqlString = "SELECT * FROM DEPARTMENTS WHERE CODEDEPARTMENT = @filter";
    const result = await db1.request()
      .input("filter", sql.NVarChar, filterSQL)
      .query(sqlString, { transaction: t });
    const sqlDelete = `DELETE FROM TOPICS WHERE CODETOPIC = '${codeTopic}'`;

    if(result.recordset[0].CODEDEPARTMENT == 'KHMT') {
      await db2.request()
        .query(sqlDelete, { transaction: t });
    } else if(result.recordset[0].CODEDEPARTMENT == 'KTMT') {
      await db3.request()
        .query(sqlDelete, { transaction: t });
    }
  });
  console.log('Transaction commited');
} catch (err) {
  console.log('Error connecting to databases', err);
  console.log('Transaction rolled back');
}
