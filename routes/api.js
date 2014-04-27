var passport = require('../classes/passport');
module.exports = exports = {

  // api.auth: is a middleware.
  // If the user is not logged in with cookies,
  // then check if he is logged in with HTTP Basic (therefore it is an API request)
  auth: function(req, res, next) {
    if (req.isAuthenticated())
      next()
    else
      passport.authenticate(['basic'])(req, res, next);
  },
  // api.only_loggedin: is a middleware.
  // Only users logged in with cookies
  only_loggedin: function(req, res, next) {
    if (req.isAuthenticated())
      next();
    else
      res.json(401, "Not Authorised");
  },
  // api.json: the way we return a json through API is the following:
  // we save the json into the response locals (e.g. res.locals.json={a:1})
  // and then send it as json
  json: function(req, res) {
    res.json(res.locals.json);
  }
}
