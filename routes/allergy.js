var db = require('../models');
var Routes = {};
var __ = require('underscore');
var async = require('async');

Routes.create = function(req, res, next) {

  //TODO generalise for the req.params.user
  
  db.Allergy.create({
    userId: req.user.id,
    name: req.body.name
  }).complete(function(err, result) {
    if (!!err) return res.json(500, {status:"Error creating the user"});
    res.locals.json = {id: result.id, userId: result.userId};
    next();    
  });

}


Routes.del = function(req, res, next) {
  db.Allergy.destroy({id: req.params.allergyId}).complete(function(err, allergy){
    if (!!err) return res.json(500, "Error deleting the user");
    res.locals.json = {status: "OK"};
    next();
  })
};

module.exports = exports = Routes;