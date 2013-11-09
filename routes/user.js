var Model = require('../models/user');
var db = require('../classes/mysql');
var Routes = {};

Routes.create = function(req, res, next) {

  Model
    .create(req.body.username, req.body.password, req.body.name, req.body.surname)
    .then(function(model){
      res.locals.json = model;
      next();
    });
}

Routes.update = function(req, res, next) {

  res.locals.json = {
    message:"OK"
  };
  next();
};

Routes.del = function(req, res, next) {

  db.query('DELETE FROM users WHERE username = ?', req.params.username, function(err, rows){
    if (err) return res.json(500, "Error deleting the user");
    res.locals.json = {status: "OK"};
    next();
  });

};

Routes.get = function(req, res, next) {

  db.query('SELECT DISTINCT * FROM users WHERE username = ?', req.params.username, function(err, rows){
    if (err) return res.json(500, {error:"Error in finding a user in DB"});
    if (rows.length == 0) return res.json(500, {error:"User not found"});

    res.locals.json = rows[0];
    next();
  });

};

Routes.query = function(req, res, next) {

  /*
   * Model.query().then(function(models){
   * res.locals.json = models;
   * next();
   * })
   */

  db.query('SELECT * FROM users', function(err, rows) {
    if (err) return res.json(500, {error:"Error in listing the users"})
    res.locals.json = rows;
    next();
  })

};

module.exports = exports = Routes;
