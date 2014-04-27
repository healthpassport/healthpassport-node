var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var db = require('../models');
var bcrypt = require('bcryptjs');

// Deserialise a connected user by lookin his ID into DB
// and storing hi session in Redis
passport.deserializeUser(function (id, done) {
  console.log("passport: THE ID",id)
  db.User.find(id).complete(function(err, result) {
    done(err, result)
  });
});

// Serialise a connected user from his id in Redis
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Cookies strategy
passport.use(new LocalStrategy(function(username, password, done) {
  db.User.find({where:{username: username}}).complete(function(err, user) {
    console.log("passport: login", err, user);
    if (!user) return done({error: "passport: no user"});
    console.log("passport: THE USER", user.dataValues);
    
    if (user.password == password) {
      return done(null, user.dataValues)
    } else {
      return done(err, false)
    }
    
    
    // bcrypt.compare(password, user.password, function(err, isMatch) {
    //   if (err) return done(err);
    //   if(isMatch) {
    //     return done(null, user);
    //   } else {
        return done(null, false, { message: 'Invalid password' });
    // }
    // });
  });
}));

// HTTP Basic Auth strategy
passport.use(new BasicStrategy(function(username, password, done) {
  db.User.find({where:{username: username}}).complete(function(err, user) {

    console.log("passport: login", err, user);
    if (!user) return done({error: "passport: no user"});
    console.log("passport: THE USER", user.dataValues);
    
    if (user.password == password) {
      return done(null, user.dataValues)
    } else {
      return done(err, false)
    }

    return done(null, false, { message: 'Invalid password' });

  });
}));

module.exports = passport;