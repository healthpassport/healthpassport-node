var mysql = require('mysql');
var async = require('async');
var connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || ''
});
connection.connect();
var db = connection;

async.waterfall([
  function(cb) {
    console.log(1);
    db.query('CREATE DATABASE IF NOT EXISTS healthpass', cb)
  },
  function(){
    var cb = arguments[arguments.length-1];
    db = require('./classes/mysql');
    console.log(3);
    db.query('CREATE TABLE IF NOT EXISTS users \
             ( \
              username VARCHAR(30) PRIMARY KEY, \
              password VARCHAR(30), \
              name     VARCHAR(30), \
              surname  VARCHAR(30)  \
             );', cb);
  },
  function() {
    var cb = arguments[arguments.length-1];
    console.log(4);
    db.query('INSERT INTO users VALUES ("nicolagreco", "pass", "Nicola", "Greco");', cb);
  }
], function(err, result) {
  console.log(err, !err ? "Done" : null);
});
