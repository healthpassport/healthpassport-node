var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var db = require('./mysql.js');
var bcrypt = require('bcryptjs');

passport.deserializeUser(function (id, done) {
  console.log("THE ID",id)
  db.query('SELECT * FROM users WHERE uid = ?;', id, function(err, result) {
    done(err, result[0])
  });
});

passport.serializeUser(function(user, done) {
  done(null, user.uid);
});



passport.use(new LocalStrategy(function(username, password, done) {
  db.query('SELECT * FROM users WHERE username=?', username, function(err, result) {
    if (result.length == 0) return done({error: "no user"});
    var user = result[0];
    console.log("THE USER", user);
    
    if (user.password == password) {
      return done(null, user)
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