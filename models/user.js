var db = require('../classes/mysql');
var Q = require('q');
var __ = require('underscore');

var Model = function(obj) {
  this.username = obj.username;
  this.password = obj.password;
  this.name = obj.name;
  this.surname = obj.surname;
};
Model.prototype.toObject = function() {
  return {
    username: this.username,
    password: this.password,
    name: this.name,
    surname: this.surname
  };
}
Model.prototype.create = function() {
  var query = 'INSERT INTO users SET ?;';
  var deferred = Q.defer();
  var model = this;

  db.query(query, this.toObject(), function(err, result) {
    if (err) return deferred.reject(new Error("Error in creating user"));
    deferred.resolve(model);
  });
  return deferred.promise;
}

Model.create = function(username, password, name, surname) {
  var model = new Model({username: username, password:password, name:name, surname: surname});
  return model.create();
}

Model.query = function() {
  var query = 'SELECT * FROM users';
  var deferred = Q.defer();

  db.query(query, function(err, rows){
    if (err) return deferred.reject(new Error("Impossible to query users"))
    return deferred.resolve(rows);
  })
  return deferred.promise;
}
module.exports = exports = Model;
