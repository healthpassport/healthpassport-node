var Model = require('../models/user');
var db = require('../classes/mysql');
var Routes = {};
var __ = require('underscore');

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

  console.log(update);
  if (__.keys(update).length == 0) {
    res.locals.json = {status: "OK"};
    next();
    return;
  }

  db.query('UPDATE users SET ? WHERE username = ?', [update, req.params.username], function(err, rows) {
    if (err) return res.json(500, {status:"Error updating the user"});
    if (rows.affectedRows == 0) return res.json(500, {status:"User not found"});
    res.locals.json = {status: "OK"};
    next();
  })

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
