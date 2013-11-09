var Routes = {};
Routes.json = function(req, res) {
  res.json(res.locals.json);
};

Routes.err = function(req, res) {
  res.json(500, res.locals.json);
};

module.exports = exports = Routes;
