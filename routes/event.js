var db = require('../models');
var Routes = {};
var __ = require('underscore');
var async = require('async');
var bcrypt = require('bcryptjs');


Routes.create = function(req, res, next) {
  db.Event.create({
    userId: req.user.id,
    title: req.body.title,
    time: req.body.time,
    kind: req.body.kind,
    description: req.body.description
  }).complete(function(err, result) {
    if (err) return res.json(500, {status:"Error creating the user"});
    res.locals.json = {status: "OK"};
    next();
  });
}

Routes.query = function(req, res, next) {
  
  db.Event.findAll({userId: req.params.userId}, function(err, result) {
    res.locals.json = result;
    return next(err);    
  })
}

module.exports = exports = Routes;
