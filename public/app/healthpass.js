var healthpass = angular.module('healthpass', ['ngRoute']);

healthpass.config(function($routeProvider) {
  $routeProvider
    .when('/', { templateUrl: '/app/views/home.html', controller:"HomeController" })
    .when('/passport', { templateUrl: '/app/views/passport.html', controller:"PassportController" })
    .when('/events', { templateUrl: '/app/views/events.html', controller:"EventsController" })
    .when('/signup', { templateUrl: '/app/views/signup.html', controller:"SignupController" })
    .when('/happy', { templateUrl: '/app/views/emotion.html', controller:"EmotionController" })
    .when('/sad', { templateUrl: '/app/views/emotion.html', controller:"EmotionController" })
    .when('/pain', { templateUrl: '/app/views/emotion.html', controller:"EmotionController" })
    .when('/contacts', { templateUrl: '/app/views/contacts.html', controller:"ContactsController"})
    .when ('/add_contact', { templateUrl: '/app/views/add_contact.html', controller:"AddContactController"})
    .when ('/add_event', { templateUrl: '/app/views/add_event.html', controller:"AddEventController"})
    .when('/allergies',{templateUrl:'/app/views/allergies.html', controller:"AllergyController"})

});

healthpass.controller('HomeController', function($scope, Me, $req) {
});

healthpass.controller('AddEventController', function($scope, Me) {
  $scope.saveEvent = function(data) {
    $scope.me.addEvent(data).then(function() {  
      $scope.data = {};
    });
  };
});

healthpass.controller('SignupController', function($scope) {});

healthpass.controller('ContactsController', function($scope, $location, Me) {
});

healthpass.controller('EventsController', function($scope, $location, Me) {
});


healthpass.controller('AddContactController', function($scope, $location, Me) {

  $scope.data = {};

  $scope.goBack = function(){
    $location.path('/contacts');
  }

  $scope.saveContact = function(data){

    $scope.me.addContact(data).then(function(){
      $location.path('/contacts');
    });
  }

});

healthpass.controller('AllergyController', function($scope, Me){
  $scope.data={};

  $scope.presetAllergies=[{name: 'peanuts'}, {name: 'milk'},{name: 'dust'},{name: 'banana'}].map(function(one) { one.active = 0; return one;});
  var preset_allergies = $scope.presetAllergies.map(function(allergy) {return angular.copy(allergy.name);});
  $scope.presetAllergies=[{name: 'peanuts'}, {name: 'milk'},{name: 'dust'},{name: 'banana'}];
  $scope.notSelectedAllergies = [];
  
  var preset_allergies = $scope.presetAllergies.map(function(allergy) {return angular.copy(allergy.name)});
  
  Me.promise.then(function() {

    console.log($scope.notSelectedAllergies)
    
    // iterate through all the existing allergies
    for (var i = 0; i < $scope.presetAllergies.length; i++) {
      var current_allergy = angular.copy($scope.presetAllergies[i]);
      console.log("current:", current_allergy.name, i)

      // iterate through all the user allergies
      var found = false;
      for (var j = 0; j < $scope.me.allergies.length; j++) {
        var current_user_allergy = $scope.me.allergies[j];
        if (current_allergy.name == current_user_allergy.name) {
          found = true;
          break
        }
      }
      if (!found) $scope.notSelectedAllergies.push(current_allergy);
    }
    
  });
  
  $scope.addAllergy = function(allergy) {
    $scope.me.addAllergy(allergy).then(function() {
      for (var i=0; i < $scope.notSelectedAllergies.length; i++) {
        if (allergy.name == $scope.notSelectedAllergies[i].name) {
          $scope.notSelectedAllergies.splice(i, 1);
          break;
        }
      }
    })
  }
  
  $scope.removeAllergy = function(allergy) {
    console.log("bad allergy", allergy)
    
    $scope.me.removeAllergy(allergy).then(function() {
      $scope.notSelectedAllergies.push(allergy)
    })
  }

});

healthpass.controller('PassportController', function($scope) {
});

healthpass.controller('MainController', function($scope, Me, $location) {
  
  Me.promise.then(function(user) {
    $scope.me = user;
  });
  
  $scope.isRoute = function(route) {
    return $location.path() == route;
  }

});

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
  this.promise = User.getMe()
  this.promise.then(function(value) {
      this.user = value;
    })
})

healthpass.factory('User', function($http, Allergy, $req, Emotion, Contact, Event) {
  
  var response_to_model = function (json, Model) {
    return json.map(function(element) { return new Model(element) });
  }
  
  var Model = function(opts) {
    opts || (opts = {});

    // TODO improve this with _underscore
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })

    this.allergies = opts.allergies ? response_to_model(opts.allergies, Allergy) : [];
    this.emotions = opts.emotions ? response_to_model(opts.emotions, Emotion) : [];
    this.events = opts.emotions ? response_to_model(opts.events, Event) : [];
    this.contacts = opts.contacts ? response_to_model(opts.contacts, Contact) : [];

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
  
  Model.prototype.removeAllergy = function(allergy) {
    var _user = this;
    
    return allergy.delete().then(function() {
      var index = _user.allergies.indexOf(allergy);
      _user.allergies.splice(index,1)
    });
  };
  
  
  Model.prototype.addEmotion = function(json) {
    var _user = this;
    var emotion = new Emotion(json);
    return emotion.create().then(function() {
      _user.emotions.push(emotion);
    })
  }
  
  Model.prototype.addEvent = function(json) {
    var _user = this;
    var _event = new Event(json);
    return _event.create().then(function() {
      _user.events.push(_event);
    })
  }

    Model.prototype.addContact = function(json) {
    var _user = this;
    var contact = new Contact(json);
    return contact.create().then(function(model) {
      console.log(model, _user);
      _user.contacts.push(model);
    })
  }

  return Model;
});

healthpass.factory('Allergy', function($req) {
  var Model = function(opts) {
    opts || (opts = {});

    // TODO improve this with _underscore
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
  }
  Model.get = function(uid, aid) {
    return $req.get('/api/v1/users/'+uid+'/allergies/'+aid).then(function(response) {
      return new Model(response.data)
    })
  }
  
  Model.prototype.create = function() {
    _model = this
    return $req.post('/api/v1/allergies', _model).then(function(response) {
      _model.uid = response.data.uid;
      _model.allergy_id = response.data.allergy_id;
      console.log("created", _model, response.data.allergy_id)
      return new Model(_model);
    })
  }
  
  Model.prototype.delete = function() {
    return $req.delete('/api/v1/users/'+ this.uid +'/allergies/'+this.allergy_id).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.save = function(uid) {
    return $req.put('/api/v1/users/' + (this.uid || uid), this).then(function(response) {
      return response.data
    })
  }
  return Model;
});


healthpass.factory('Contact', function($req) {
var Model = function(json) {
    this.name = json.name;
    this.surname = json.surname;
    this.description = json.description;
    this.kind = json.kind;
    this.picture = json.picture;
    this.nickname = json.nickname;
    this.telephone = json.telephone;
  }
  
  Model.prototype.create = function() {
    _model = this
    return $req.post('/api/v1/contacts', _model).then(function(response) {
      _model.uid = response.data.uid;
      return new Model(_model);
    })
  }

   Model.prototype.save = function(uid) {
    $req.put('/api/v1/users/' + (this.uid || uid) + '/contacts', this).then(function(response) {
      return response.data
    })
  }

    Model.get = function(uid, cid) {
    return $req.get('/api/v1/users/'+uid+'/contacts/'+cid).then(function(response) {
      return new Model(response.data)
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

healthpass.factory('Event', function($req) {
  var Model = function(opts) {
    opts || (opts = {});
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
  }
  
  Model.prototype.create = function() {
    _model = this
    return $req.post('/api/v1/events', _model).then(function(response) {
      _model.uid = response.data.uid;
      _model.eventid = response.data.eventid;
      return new Model(_model);
    })
  }
  
  return Model;
});