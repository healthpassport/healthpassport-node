var db = require('../models');
var Routes = {};
var __ = require('underscore');
var async = require('async');
var bcrypt = require('bcryptjs');


Routes.create = function(req, res, next) {
  db.Emotion.create({
    userId: req.user.id,
    emotion_type: req.body.emotion_type,
    location: req.body.location,
    description: req.body.description
  }).complete(function(err, results) {
    if (!!err) return res.json(500, {status:"Error creating the user"});
    res.locals.json = {status: "OK"};
    next();
  })
}

Routes.query = function(req, res, next) {
  db.Emotion.findAll({userId: req.params.userId}, function(err, result) {
    res.locals.json = result;
    return next(err);    
  })
}

module.exports = exports = Routes;
