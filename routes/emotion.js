var Model = require('../models/user');
var db = require('../classes/mysql');
var Routes = {};
var __ = require('underscore');
var async = require('async');
var bcrypt = require('bcryptjs');


Routes.create = function(req, res, next) {

  var values = {
    uid: req.user.uid,
    emotion_type: req.body.emotion_type,
    date: new Date(),
    location: req.body.location,
    description: req.body.description
  };

  db.query('INSERT INTO emotions SET ?;', values, function(err, rows){
    console.log("BBBB", err, rows)
    if (err) return res.json(500, {status:"Error creating the user"});
    res.locals.json = {status: "OK"};
    next();
  });
}

Routes.query = function(req, res, next) {
  db.query('SELECT * FROM emotions WHERE uid=(SELECT uid FROM users WHERE username=?);', req.params.username, function(err, result) {
    res.locals.json = result;
    return next(err);
  })
}

module.exports = exports = Routes;
