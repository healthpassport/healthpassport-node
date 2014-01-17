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
             uid INT AUTO_INCREMENT PRIMARY KEY, \
             username VARCHAR(30), \
             password VARCHAR(60), \
             name     VARCHAR(30), \
             surname  VARCHAR(30), \
             email  VARCHAR(60), \
             avatar VARCHAR(60), \
             role  VARCHAR(30), \
             telephone  VARCHAR(30), \
             creation_time DATETIME, \
             update_time DATETIME \
             );', cb);
    });
  },
   function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE patients', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS patients \
             ( \
             uid INT, \
             disability_level VARCHAR(30), \
             understanding_level VARCHAR(60), \
             communication_type VARCHAR(30), \
             support_hours INT \
             );', cb);
    });
  },
   function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE allergies', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS allergies \
             ( \
             uid INT, \
             allergy_id INT AUTO_INCREMENT PRIMARY KEY, \
             name VARCHAR(30), \
             creation_time DATETIME \
             );', cb);
    });
  },
   function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE positions', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS positions \
             ( \
             uid INT, \
             position_id INT AUTO_INCREMENT PRIMARY KEY, \
             location VARCHAR(60), \
             date DATETIME \
             );', cb);
    });
  },
    function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE patient_relations', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS patient_relations \
             ( \
             uid INT, \
             patient_id INT AUTO_INCREMENT PRIMARY KEY, \
             kind VARCHAR(30) \
             );', cb);
    });
  },
   function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE pictures', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS pictures \
             ( \
             uid INT, \
             picture_id INT AUTO_INCREMENT PRIMARY KEY, \
             url VARCHAR(40) \
             );', cb);
    });
  },
   function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE answers', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS answers \
             ( \
             uid INT, \
             question_id INT AUTO_INCREMENT PRIMARY KEY, \
             answer INT \
             );', cb);
    });
  },
   function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE questions', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS questions \
             ( \
             uid INT, \
             question_id INT  AUTO_INCREMENT PRIMARY KEY, \
             title VARCHAR(30), \
             picture VARCHAR(40) \
             );', cb);
    });
  },
   function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE events', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS events \
             ( \
             uid INT, \
             event_id INT AUTO_INCREMENT PRIMARY KEY, \
             title VARCHAR(40), \
             kind VARCHAR(20), \
             time DATETIME, \
             description VARCHAR(80) \
             );', cb);
    });
  },
   function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE emotions', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS emotions \
             ( \
             uid INT, \
             emotion_id INT AUTO_INCREMENT PRIMARY KEY, \
             emotion_type VARCHAR(20), \
             date DATETIME, \
             location VARCHAR(80), \
             description VARCHAR(80) \
             );', cb);
    });
  },
   function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE contacts', function(err, result) {
        db.query('CREATE TABLE IF NOT EXISTS contacts \
             ( \
             uid INT, \
             contact_id INT AUTO_INCREMENT PRIMARY KEY, \
             name VARCHAR(30), \
             surname VARCHAR(30), \
             description VARCHAR(80), \
             kind VARCHAR(20), \
             telephone VARCHAR(30), \
             picture VARCHAR(40), \
             nickname VARCHAR(20) \
             );', cb);
    });
  },

  function(){
    var cb = arguments[arguments.length-1];
    db.query('DROP TABLE addresses', function(err, result) {
      db.query('CREATE TABLE IF NOT EXISTS addresses \
           ( \
           uid INT, \
           city VARCHAR(60), \
           number VARCHAR(8), \
           postcode VARCHAR(20), \
           country VARCHAR(60), \
           street VARCHAR(60) \
           );', cb);
    });
  },
  function() {
    var cb = arguments[arguments.length-1];
    db.query('INSERT INTO addresses SET ?', {
      uid: 1,
      street: "Stranhope Street",
      city: "London",
      number: 14,
      postcode: "NW13A",
      country: "United Kingdom"
    }, cb);
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
