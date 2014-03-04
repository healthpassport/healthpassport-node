var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');
var bcrypt = require('bcryptjs');

passport.deserializeUser(function (id, done) {
  console.log("passport: THE ID",id)
  db.User.find(id).complete(function(err, result) {
    done(err, result)
  });
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});



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

module.exports = passport;