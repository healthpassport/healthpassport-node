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
    db.query('CREATE DATABASE IF NOT EXISTS '+ process.env.MYSQL_DATABASE, cb)
  },
  function(){
    var cb = arguments[arguments.length-1];
    db = require('./classes/mysql');
    console.log(3);
    db.query('DROP TABLE users', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS users \
             ( \
              username VARCHAR(30) PRIMARY KEY, \
             password VARCHAR(60), \
             name     VARCHAR(30), \
             surname  VARCHAR(30), \
             email  VARCHAR(60), \
             address_city  VARCHAR(30), \
             address_number  VARCHAR(30), \
             address_postcode  VARCHAR(30), \
             address_country  VARCHAR(30), \
             address_street  VARCHAR(30), \
             nhs  VARCHAR(30), \
             role  VARCHAR(30), \
             telephone  VARCHAR(30), \
             support_hours  VARCHAR(30) \
             );', cb);

    });

    db.query('DROP TABLE information', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS information \
             ( \
              username VARCHAR(30) PRIMARY KEY, \
             type VARCHAR(30), \
             value VARCHAR(60) \
             );', cb);

    });
  },
  function() {
    var cb = arguments[arguments.length-1];
    console.log(4);
    db.query('INSERT INTO users SET ?', {username:"nicolagreco", password:"pass"}, cb);
  }
], function(err, result) {
  console.log(err, !err ? "Done" : null);
});

