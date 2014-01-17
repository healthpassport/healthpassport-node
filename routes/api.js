var Routes = {};

Routes.only_loggedin = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.send(401);
};

Routes.json = function(req, res) {
  res.json(res.locals.json);
};

Routes.err = function(req, res) {
  res.json(500, res.locals.json);
};

module.exports = exports = Routes;
