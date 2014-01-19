var Model = require('../models/user');
var db = require('../classes/mysql');
var Routes = {};
var __ = require('underscore');
var async = require('async');
var bcrypt = require('bcryptjs');


Routes.create = function(req, res, next) {

  var values = {
    uid: req.user.uid,
    name: req.body.name,
    surname: req.body.surname,
    description: req.body.description,
    kind: req.body.kind,
    telephone: req.body.telephone,
    picture: req.body.picture,
    nickname: req.body.nickname
  };

  db.query('INSERT INTO contacts SET ?;', values, function(err, rows){
    console.log("Cisdjkdsk", err, rows)
    if (err) return res.json(500, {status:"Error creating the contact"});
    res.locals.json = {status: "OK"};
    next();
  });
}

Routes.query = function(req, res, next) {
  db.query('SELECT * FROM contacts WHERE uid=(SELECT uid FROM users WHERE username=?);', req.params.username, function(err, result) {
    res.locals.json = result;
    return next(err);
  })
}

module.exports = exports = Routes;
