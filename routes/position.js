var db = require('../models');

module.exports = exports = {
  create: function(req, res, next) {
    
    db.Position.create({
      userId: req.user.id,
      lat: req.user.lat,
      lon: req.body.lon
    }).complete(function(err, result) {
      if (!!err) return res.json(500, {status:"Error creating position"});
      res.locals.json = {id: result.id, userId: result.userId};
      next();    
    });

  }
};