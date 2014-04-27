var db = require('../models');

module.exports = exports = {
  create: function(req, res, next) {
    
    db.Allergy.create({
      userId: req.user.id,
      name: req.body.name
    }).complete(function(err, result) {
      if (!!err) return res.json(500, {status:"Error creating the user"});
      res.locals.json = {id: result.id, userId: result.userId};
      next();    
    });

  },
  del: function(req, res, next) {
    db.Allergy.destroy({id: req.params.allergyId}).complete(function(err, allergy){
      if (!!err) return res.json(500, "Error deleting the user");
      res.locals.json = {status: "OK"};
      next();
    })
  }
};