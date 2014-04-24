var api_server = "http://127.0.0.1:3000"
var factories = angular.module('healthpass.factories', []);

factories.factory('cordovaReady', function() {
  return function (fn) {

    var queue = [];

    var impl = function () {
      queue.push(Array.prototype.slice.call(arguments));
    };

    document.addEventListener('deviceready', function () {
      queue.forEach(function (args) {
        fn.apply(this, args);
      });
      impl = fn;
    }, false);

    return function () {
      return impl.apply(this, arguments);
    };
  };
});

factories.service('Me', function(User) {
  this.user = new User();
  this.promise = User.getMe()
  this.promise.then(function(value) {
      this.user = value;
    })
})

factories.value('cordovaValue', 0);

factories.factory("$local", function() {
  var checkDB = function(model) {
    console.log(typeof model);
  }
  return checkDB;
});

factories.service("$remote", function($local, $http, pouchdb) {
  this.get    = $http.get
  this.post   = $http.post
  this.put    = $http.put
  this.delete = $http.delete
});

factories.service("$req", function(cordovaValue, $remote, $local, CordovaService) {

  function isConnected () {

    alert("checking")

    if (navigator && navigator.network && navigator.connection) {
      alert(navigator.network.connection.type)
      return navigator.connection.type == Connection.NONE ? 0 : 1;
    } else return 1;
  }

});

factories.factory('User', function($http, Allergy, $remote, Emotion, Contact, Event) {
  
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
  
  Model.get = function(id) {
    return $remote.get(api_server+'/api/v1/users/'+ id).then(function(response) {
      return new Model(response.data)
    })
  }
  
  Model.query=function(){
    return $remote.get(api_server+'/api/v1/users/').then(function(response){
      return response.data.map(function(user){
        return new Model(user);
      })
    });
  }

  Model.getMe = function(uid) {
    return $remote.get(api_server+'/api/v1/me').then(function(response) {
      return new Model(response.data)
    })
  }

  
  Model.prototype.create = function() {
    _model = this;
    $remote.post(api_server+'/api/v1/users', _model).then(function(response) {
      _model.id = response.data.id;
      return _model;
    })
  }
  
  Model.prototype.delete = function(id) {
    $remote.put(api_server+'/api/v1/users/'+ (this.id || id)).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.save = function(id) {
    return $remote.put(api_server+'/api/v1/users/' + (this.id || id), this).then(function(response) {
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

factories.factory('M', function($remote) {
  var GenericModel = function(Model) {
  }
  GenericModel.init = function(opts) {
    opts || (opts = {});
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
    console.log(_this)
  }
  GenericModel.get = function(route) {
    var Model = this;
    return $remote.get(api_server+route).then(function(response) {
      return new Model(response.data)
    })
  }
  GenericModel.delete = function(route) {
    return $remote.delete(route).then(function(response) {
      return response.data
    })
  }
  GenericModel.save = function(route) {
    return $remote.put(route, this).then(function(response) {
      return response.data
    })
  }
  GenericModel.createWithUser = function(route, Model) {
    var _model = this
    return $remote.post(route, _model).then(function(response) {
      _model.userId = response.data.userId;
      _model.id = response.data.id;
      return new Model(_model);
    })
  }
  GenericModel.create = function(route, Model) {
    var _model = this
    return $remote.post(api_server+'/api/v1/contacts', _model).then(function(response) {
      _model.id = response.data.id;
      return new Model(_model);
    })
  }
  return GenericModel
})

factories.factory('Allergy', function(M) {
  var Model = function(opts) { M.init.call(this, opts) }
  Model.get = function(userId, id) { return M.get.call(this, '/api/v1/users/'+userId+'/allergies/'+id) }
  Model.prototype.create = function() { return M.createWithUser.call(this, '/api/v1/allergies', Model) }
  Model.prototype.save = function(userId) { return M.save.apply(this, '/api/v1/users/' + (this.userId || userId)) }
  Model.prototype.delete = function() { return M.delete.call(this, '/api/v1/users/'+ this.userId +'/allergies/'+this.id)}
  return Model;
});


factories.factory('Contact', function(M) {
  var Model = function(opts) { M.init.call(this, opts) }
  Model.get = function(userId, id) { return M.get.call(this, '/api/v1/users/'+userId+'/contacts/'+id) }
  Model.prototype.create = function() { return M.create.call(this, '/api/v1/contacts', Model) }
  Model.prototype.save = function(userId) { return M.save.apply(this, '/api/v1/users/' + (this.userId || userId) + '/contacts') }
  return Model;
});




factories.factory('Emotion', function(M) {
  var Model = function(opts) { M.init.call(this, opts) }
  Model.prototype.create = function() { return M.createWithUser.call(this, '/api/v1/emotions', Model) }
  return Model;
});

factories.factory('Event', function(M) {
  var Model = function(opts) {
    opts || (opts = {});
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
  }
  
  Model.prototype.create = function() {
    _model = this
    return $remote.post(api_server+'/api/v1/events', _model).then(function(response) {
      _model.userId = response.data.userId;
      _model.id = response.data.id;
      return new Model(_model);
    })
  }
  
  return Model;
});
factories.factory('Question', function($remote) {
  var Model = function(opts) {
    opts || (opts = {});
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
    return Model;
  }

  Model.get = function(id) {
    return $remote.get(api_server+'/api/v1/questions/'+id).then(function(response) {
      return new Model(response.data)
    })
  }

  Model.query= function(){
  return $remote.get(api_server+'/api/v1/questions').then(function(response) {
      return response.data.map(function(question){
        return new Model(question);
      })
    })

  }

  Model.prototype.answer = function(answer){
    var _model = this;
    return $remote.post(api_server+'/api/v1/questions/'+this.id, answer).then(function(response){
      _model.answer = answer;
      return _model;
    });
  }
});