var db = require('../models');
var Routes = {};
var __ = require('underscore');
var async = require('async');
var bcrypt = require('bcryptjs');


Routes.create = function(req, res, next) {

  var values = {
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    role: req.body.role
  };

  if (!values.password || !values.username || !values.name || !values.surname || !values.password || !values.role) {
    return res.json(500, {status: "Parameters missing for creating the user"});
  }
  async.waterfall([
    function(cb) {

      // If the password is updated, we have to generete a new hash in bcrypt
      bcrypt.genSalt(10, function(err, salt) {
        if (!!err) return cb(err, "Cannot update password");
        bcrypt.hash(values.password, salt, function(err, hash) {
          if (!!err) return cb(err, "Cannot update password");
          values.password = hash;
          cb(null, values);
        });
      });
    },
    function(values, cb) {
      db.User.create(values).complete(function(err, result) {
        if (!!err) return res.json(500, {status:"Error creating the user"});
        res.locals.json = result;
        next();        
      });
    }
  ],
  function (err, result) {
    if (!!err) return res.json(500, result);
    res.locals.json = result;
    next();
  });
}

Routes.update = function(req, res, next) {
  // var update = __.pick(req.body, 'password', 'username', 'name', 'surname', 'email', 'address_street', 'address_number', 'address_city', 'address_country', 'address_postcode', 'support_hours', 'telephone', 'disability_level', 'communication_type', 'understanding_level');
  // 
  // if (__.keys(update).length == 0) {
  //   res.locals.json = {status: "OK"};
  //   next();
  //   return;
  // }

  var update = req.body;
  async.waterfall([
    function(cb) {
      if (!update.password) return cb(null, update);

      bcrypt.genSalt(10, function(err, salt) {
        if (!!err) return cb(err, "Cannot update password");

        bcrypt.hash(update.password, salt, function(err, hash) {
          if (!!err) return cb(err, "Cannot update password");

          update.password = hash;
          cb(null, update);
        });
      });
    },
    function(update, cb) {
      console.log("updating", req.params.userId, update);
      db.User.update(update, {id:req.params.userId}).complete(function(err, user) {
        if (!!err) return cb(err, {status:"Error updating the user"});
        if (!user) return cb(true,{status:"User not found"});
        cb(null, {status: "OK"});
      })
    }
  ],
  function (err, result) {
    if (!!err) return res.json(500, result);
    res.locals.json = result;
    next();
  });

};

Routes.del = function(req, res, next) {
  db.User.destroy({id:req.params.userId}).complete(function(err, result) {
    if (!!err) {
      return res.json(500, {status:"Error deleting the user"});
    }
    res.locals.json = {status: "OK"};
    next();
  })
};

Routes.get = function(req, res, next) {
  console.log(req.params.userId);
  db.User.find({
    where: {id:req.params.userId},
    include: [db.Allergy, db.Emotion, db.Contact, db.Event, db.Picture, {model:db.Question, include: [db.Picture]}, db.Address]
  }).complete(function(err, user) {
    if (!!err) return res.json(500, {status:"Error in finding a user in DB"});
    if (!user) return res.json(500, {status:"User not found"});
    delete user.password;
    
    res.locals.json = user;
    next();
  });
};

Routes.me = function(req, res, next) {
  console.log("want to know me")
  req.params.userId = req.user.id;
  Routes.get(req, res, next)
};

Routes.query = function(req, res, next) {
  db.User.findAll({}).complete(function(err, users) {
    if (!!err) return res.json(500, {error:"Error in listing the users"})
    res.locals.json = users;
    next();
  });

};

module.exports = exports = Routes;
