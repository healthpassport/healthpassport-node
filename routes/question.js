var db = require('../models');
var Routes = {};
var __ = require('underscore');
var async = require('async');

Routes.answer = function(req, res, next) {

  db.Question.update({answer: req.body.answer}, {id:req.params.questionId})
  .complete(function(err, question) {
    if (!!err) return res.json(500, {status:"Error updating the user"});
    if (!question) return res.json(404,{status:"User not found"});
    res.locals.json =  {status: "OK"};
    next();
  })

};

module.exports = exports = Routes;