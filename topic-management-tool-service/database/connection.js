
const sql = require('mssql')
const {MCSR01, MCSR02, MCSR03} = require('./config')
const connectDB = async (server) => {
  await sql.close()
  
   if(server == "MCSR01"){
      console.log("connect server: " + server);
      let pool = await sql.connect(MCSR01).catch(err => console.log(err))
      return pool
  }
  if(server == "MCSR02"){
    console.log("connect server: " + server);
    let pool = await sql.connect(MCSR02).catch(err => console.log('MCSR02',err))
    return pool
}

if(server == "MCSR03"){
  console.log("connect server: " + server);
  let pool = await sql.connect(MCSR03).catch(err => console.log(err))
  return pool
}
}

module.exports = {
  connectDB, sql
}
