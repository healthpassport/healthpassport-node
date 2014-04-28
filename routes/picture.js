var db = require('../models');

module.exports = exports = {
  create: function(req, res, next) {
    var file = "/"+req.files.pic.path.split("/").slice(-2).join("/")
    db.Picture.create({
      userId: req.user.id,
      url: file
    }).complete(function(err, result) {
      if (!!err) return res.json(500, {status:"Error creating the user"});
      res.locals.json = {id: result.id, url: file};
      next();    
    });

  },
  del: function(req, res, next) {
    db.Picture.destroy({id: req.params.allergyId}).complete(function(err, allergy){
      if (!!err) return res.json(500, "Error deleting the user");
      res.locals.json = {status: "OK"};
      next();
    })
  },
  query: function(req, res, next) {
    db.Picture.findAll({}).complete(function(err, pictures) {
      if (!!err) return res.json(500, {error:"Error in listing the pictures"})
      res.locals.json = pictures;
      next();
    })
  }
};