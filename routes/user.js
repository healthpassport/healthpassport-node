var Routes = {};

Routes.create = function(req, res, next) {

  res.locals.json = {
    user_id:1
  };
  next();
}

Routes.update = function(req, res, next) {

  res.locals.json = {
    message:"OK"
  };
  next();
};

Routes.del = function(req, res, next) {

  res.locals.json = {
    message:"OK"
  };
  next();
};

Routes.get = function(req, res, next) {

  res.locals.json = {
    user_id:1
  };
  next();
};

Routes.query = function(req, res, next) {

  res.locals.json = [{
    user_id:1
  },
  {
    user_id:2
  }];

  next();
};

module.exports = exports = Routes;
