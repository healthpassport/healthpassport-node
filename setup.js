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
    console.log("Creating database tables");
    db.query('CREATE DATABASE IF NOT EXISTS '+ process.env.MYSQL_DATABASE, cb)
    db = require('./classes/mysql');
  },
  function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE users', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS users \
             ( \
             username VARCHAR(30) PRIMARY KEY, \
             password VARCHAR(60), \
             name     VARCHAR(30), \
             surname  VARCHAR(30), \
             email  VARCHAR(60), \
             avatar VARCHAR(60), \
             nhs  VARCHAR(30), \
             role  VARCHAR(30), \
             telephone  VARCHAR(30), \
             support_hours  VARCHAR(30), \
             creation_time DATETIME, \
             update_time DATETIME \
             );', cb);
    });
  },
  function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE addresses', function(err, result) {
      db.query('CREATE TABLE IF NOT EXISTS addresses \
           ( \
           username VARCHAR(30) PRIMARY KEY, \
           city VARCHAR(60), \
           number VARCHAR(60), \
           postcode VARCHAR(60), \
           country VARCHAR(60), \
           street VARCHAR(60) \
           );', cb);
    });
  },
  function() {
    var cb = arguments[arguments.length-1];
    db.query('INSERT INTO users SET ?', {
      username:"nicolagreco",
      password:"pass",
      name:"Nicola",
      surname:"Greco",
      email:"email@example.org",
      creation_time: new Date(),
      update_time: new Date(),
      role: "patient"
    }, cb);
  }
], function(err, result) {
  console.log(!err ? "Database created!" : "Errors have occurred", err || "");
  process.exit(0)
});
