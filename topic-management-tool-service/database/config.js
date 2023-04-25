var MCSR01 = {
  server: 'MANHCUONG\\MCSR01',
  user: 'sa',
  password: '1712',
  database: 'TopicManager',
  options: {
    trustServerCertificate: true,
  },
  }
  
  var MCSR02 = {
  server: 'MANHCUONG\\MCSR02',
  user: 'sa',
  password: '1712',
  database: 'TopicManagerSR2',
  options: {
    trustServerCertificate: true,
  },
  }
  
  var MCSR03 = {
    server: 'MANHCUONG\\MCSR03',
    user: 'sa',
    password: '1712',
    database: 'TopicManagerSR3',
    options: {
      trustServerCertificate: true,
    },
    }
  
  module.exports = {MCSR02,MCSR01,MCSR03}
  