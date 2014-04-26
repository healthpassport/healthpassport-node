var passport = require('../classes/passport');
module.exports = exports = {
  auth: function(req, res, next) {
    if (req.isAuthenticated())
      next()
    else
      passport.authenticate(['basic'])(req, res, next);
  },
  only_loggedin: function(req, res, next) {
    if (req.isAuthenticated())
      next();
    else
      res.json(401, "Not Authorised");
  },
  json: function(req, res) {
    res.json(res.locals.json);
  }
}
