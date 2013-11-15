var Model = require('../models/user');
var db = require('../classes/mysql');
var Routes = {};
var __ = require('underscore');
var async = require('async');
var bcrypt = require('bcrypt');

Routes.create = function(req, res, next) {

  /*
  Model
    .create(req.body.username, req.body.password, req.body.name, req.body.surname)
    .then(function(model){
      res.locals.json = model;
      next();
    });
  */
  var values = {
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname
  };

  db.query('INSERT INTO users SET ?;', values, function(err, rows){
    if (err) return res.json(500, {status:"Error creating the user"});
    res.locals.json = {status: "OK"};
    next();
  });
}

Routes.update = function(req, res, next) {
  var update = {};
  if (req.body.password) update.password = req.body.password;
  if (req.body.name) update.name = req.body.name;
  if (req.body.surname) update.surname = req.body.surname;

  if (__.keys(update).length == 0) {
    res.locals.json = {status: "OK"};
    next();
    return;
  }

  async.waterfall([
    function(cb) {
      if (!update.password) return cb(null, update);

      bcrypt.genSalt(10, function(err, salt) {
        if (err) return cb(err, "Cannot update password");

        bcrypt.hash(update.password, salt, function(err, hash) {
          if (err) return cb(err, "Cannot update password");

          update.password = hash;
          cb(null, update);
        });
      });
    },
    function(update, cb) {
    console.log(req.params.username, update);
      db.query('UPDATE users SET ? WHERE username = ?', [update, req.params.username], function(err, rows) {
        if (err) return cb(err, {status:"Error updating the user"});
        if (rows.affectedRows == 0) return cb(true, {status:"User not found"});
        cb(null, {status: "OK"});
      })
    }
  ],
  function (err, result) {
    if (err) return res.json(500, result);
    res.locals.json = result;
    next();
  });

};

Routes.del = function(req, res, next) {

  db.query('DELETE FROM users WHERE username = ?', req.params.username, function(err, rows){
    if (err) return res.json(500, "Error deleting the user");
    res.locals.json = {status: "OK"};
    next();
  });

};

Routes.get = function(req, res, next) {

  db.query('SELECT username,name,surname FROM users WHERE username = ?', req.params.username, function(err, rows){
    if (err) return res.json(500, {status:"Error in finding a user in DB"});
    if (rows.length == 0) return res.json(500, {status:"User not found"});

    res.locals.json = rows[0];
    next();
  });

};

Routes.query = function(req, res, next) {

  /*
   * Model.query().then(function(models){
   * res.locals.json = models;
   * next();
   * })
   */

  db.query('SELECT username,name,surname FROM users', function(err, rows) {
    if (err) return res.json(500, {error:"Error in listing the users"})
    res.locals.json = rows;
    next();
  })

};

module.exports = exports = Routes;
