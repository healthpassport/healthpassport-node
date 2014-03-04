var db = require('../models');
var Routes = {};
var __ = require('underscore');
var async = require('async');
var bcrypt = require('bcryptjs');


Routes.create = function(req, res, next) {

  db.Contact.create({
    userId: req.user.id,
    name: req.body.name,
    surname: req.body.surname,
    description: req.body.description,
    kind: req.body.kind,
    telephone: req.body.telephone,
    picture: req.body.picture,
    nickname: req.body.nickname
  }).complete(function(err, contact) {
    if (err) return res.json(500, {status:"Error creating the contact"});
    res.locals.json = {status: "OK"};
    next();
  });
}

Routes.query = function(req, res, next) {
  db.Contact.findAll({userId: req.params.userId}).complete(function(err, result) {
    res.locals.json = result;
    return next(err);
  });
}

module.exports = exports = Routes;
