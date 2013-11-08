var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQLDB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
});

module.exports = exports = connection.connect();
