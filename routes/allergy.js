var Model = require('../models/user');
var db = require('../classes/mysql');
var Routes = {};
var __ = require('underscore');
var async = require('async');

Routes.create = function(req, res, next) {

  //TODO generalise for the req.params.user
  var values = {
    uid: req.user.uid,
    name: req.body.name,
    creation_time: new Date(),
  };

  db.query('INSERT INTO allergies SET ?;', values, function(err, response){
    if (err) return res.json(500, {status:"Error creating the user"});
    res.locals.json = {allergy_id: response.insertId, uid: req.user.uid};
    next();
  });
}


Routes.del = function(req, res, next) {

  db.query('DELETE FROM allergies WHERE allergy_id = ?', req.params.allergyid, function(err, rows){
    if (err) return res.json(500, "Error deleting the user");
    res.locals.json = {status: "OK"};
    next();
  });

};

module.exports = exports = Routes;