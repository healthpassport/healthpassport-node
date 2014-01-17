var healthpass = angular.module('healthpass', ['ngRoute']);

healthpass.config(function($routeProvider) {
  $routeProvider
    .when('/', { templateUrl: '/app/views/home.html', controller:"HomeController" })
    .when('/login', { templateUrl: '/app/views/login.html', controller:"LoginController" })
    .when('/signup', { templateUrl: '/app/views/signup.html', controller:"SignupController" })
    .when('/happy', { templateUrl: '/app/views/emotion.html', controller:"EmotionController" })
    .when('/sad', { templateUrl: '/app/views/emotion.html', controller:"EmotionController" })
    .when('/pain', { templateUrl: '/app/views/emotion.html', controller:"EmotionController" })
});

healthpass.controller('HomeController', function($scope, Me, $req) {
});
healthpass.controller('LoginController', function($scope) {});

healthpass.controller('SignupController', function($scope) {});

healthpass.controller('EmotionController', function($scope, Me, Location, $location) {
  
  $scope.data = {}
  $scope.data.emotion_type = $location.path().substr(1)

  $scope.saveEmotion = function(data) {
    data.location = Location.get();
    
    Me.user.addEmotion(data).then(function() {
      $location.path('/');
    });
  }

});

healthpass.service('Location', function() {
  this.get = function() {
    return "1,1";
  }
})

healthpass.value('online', 1);

healthpass.service("$local", function() {
  this.get = function() {};
  this.post = function() {};
  this.put = function() {};
  this.delete = function() {};
});

healthpass.service("$remote", function(online, $local, $http) {
  this.get    = $http.get
  this.post   = $http.post
  this.put    = $http.put
  this.delete = $http.delete
});

healthpass.service("$req", function(online, $remote, $local) {
  this.get    = online ? $remote.get    : $local.get;
  this.post   = online ? $remote.post   : $local.post;
  this.put    = online ? $remote.put    : $local.put;
  this.delete = online ? $remote.delete : $local.delete;
});

healthpass.service('Me', function(User) {
  this.user = new User();
  User
    .getMe()
    .then(function(value) {
      this.user = value;
    })
})

healthpass.factory('User', function($http, Allergy, $req, Emotion) {
  
  var response_to_model = function (json, Model) {
    return json.map(function(element) { return new Model(element) });
  }
  
  var Model = function(opts) {
    opts || (opts = {});
    this.allergies = opts.allergies ? response_to_model(opts.allergies, Allergy) : [];
    this.emotions = opts.emotions ? response_to_model(opts.emotions, Emotion) : [];
  }
  
  Model.get = function(uid) {
    return $req.get('/api/v1/users/'+ uid).then(function(response) {
      return new Model(response.data)
    })
  }
  
  Model.getMe = function(uid) {
    return $req.get('/api/v1/me').then(function(response) {
      return new Model(response.data)
    })
  }

  
  Model.prototype.create = function() {
    _model = this;
    $req.post('/api/v1/users', _model).then(function(response) {
      _model.uid = response.data.uid;
      return _model;
    })
  }
  
  Model.prototype.delete = function(uid) {
    $req.put('/api/v1/users/'+ (this.uid || uid)).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.save = function(uid) {
    return $req.put('/api/v1/users/' + (this.uid || uid), this).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.addAllergy = function(json) {
    var _user = this;
    var allergy = new Allergy(json);
    return allergy.create().then(function() {
      _user.allergies.push(allergy);
    })
  }
  
  Model.prototype.addEmotion = function(json) {
    var _user = this;
    var emotion = new Emotion(json);
    return emotion.create().then(function() {
      _user.emotions.push(emotion);
    })
  }

  return Model;
});

healthpass.factory('Allergy', function($http) {
  var Model = function() {
  }
  Model.get = function(uid, aid) {
    return $req.get('/api/v1/user/'+uid+'/allergies/'+aid).then(function(response) {
      return new Model(response.data)
    })
  }
  
  Model.prototype.create = function() {
    _model = this
    $req.post('/api/v1/allergies', _model).then(function(response) {
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

healthpass.factory('Emotion', function($req) {
  var Model = function(json) {
    this.description = json.description
    this.emotion_type = json.emotion_type
    this.location = json.location
  }
  
  Model.prototype.create = function() {
    _model = this
    return $req.post('/api/v1/emotions', _model).then(function(response) {
      _model.uid = response.data.uid;
      return new Model(_model);
    })
  }
  
  return Model;
});