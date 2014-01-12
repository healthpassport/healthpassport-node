var healthpass = angular.module('healthpass', ['ngRoute']);

healthpass.config(function($routeProvider) {
  $routeProvider
    .when('/', { templateUrl: '/app/views/home.html', controller:"HomeController" })
    .when('/likes', { templateUrl: '/app/views/likes.html', controller:"LikesController" })
});

healthpass.service('Me',function() {

});

healthpass.variable('online', 1);

healthpass.service("$local", function() {
  this.get = function() {};
  this.post = function() {};
  this.put = function() {};
  this.delete = function() {};
});

healthpass.service("$remote", function(online, $local) {
  this.get    = $get.get
  this.post   = $get.post
  this.put    = $get.put
  this.delete = $get.delete
});

healthpass.service("$req", function(online, $remote, $local) {
  this.get    = online ? $remote.get    : $local.get;
  this.post   = online ? $remote.post   : $local.post;
  this.put    = online ? $remote.put    : $local.put;
  this.delete = online ? $remote.delete : $local.delete;
});


healthpass.factory('User', function($http, Allergy) {
  
  function response_to_model = function (json, Model) {
    return json.map(function(element) { return new Model(element) });
  }
  
  var Model = function(opts) {
    this.allergies = response_to_model(opts.allergies, Allergy);
  }
  
  Model.get = function(uid) {
    $req.get('/api/v1/user/'+uid).then(function(response) {
      return new Model(response.data)
    })
  }
  
  Model.prototype.create = function() {
    _model = this
    $req.post('/api/v1/user', _model).then(function(response) {
      _model.uid = response.data.uid;
      return new Model(_model);
    })
  }
  
  Model.prototype.delete = function(uid) {
    $req.put('/api/v1/user/'+ (this.uid || uid)).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.save = function(uid) {
    $req.put('/api/v1/user/' + (this.uid || uid), this).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.addAllergy = function(json) {
    var _user = this;
    var allergy = new Allergy(json);
    allergy.create(function() {
      _user.allergies.push(allergy);
    })
  }

  return Model;
});

healthpass.factory('Allergy', function($http) {
  var Model = function() {
  }
  Model.get = function(uid, aid) {
    $req.get('/api/v1/user/'+uid+'/allergies/'+aid).then(function(response) {
      return new Model(response.data)
    })
  }
  
  Model.prototype.create = function() {
    _model = this
    $req.post('/api/v1/user', _model).then(function(response) {
      _model.uid = response.data.uid;
      return new Model(_model);
    })
  }
  
  Model.prototype.delete = function(uid) {
    $req.put('/api/v1/user/'+ (this.uid || uid)).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.save = function(uid) {
    $req.put('/api/v1/user/' + (this.uid || uid), this).then(function(response) {
      return response.data
    })
  }
  return Model;
});


healthpass.factory('Address', function($http) {
  var Model = function() {
  }
  return Model;
});

healthpass.factory('Answer', function($http) {
  var Model = function() {
  }
  return Model;
});

healthpass.factory('Picture', function($http) {
  var Model = function() {
  }
  return Model;
});

healthpass.factory('Emotion', function($http) {
  var Model = function() {
  }
  return Model;
});

healthpass.factory('Contact', function($http) {
  var Model = function() {
  }
  return Model;
});

healthpass.factory('Question', function($http) {
  var Model = function() {
  }
  return Model;
});

healthpass.factory('Position', function($http) {
  var Model = function() {
  }
  return Model;
})