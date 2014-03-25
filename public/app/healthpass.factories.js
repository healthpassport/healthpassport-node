var factories = angular.module('healthpass.factories', []);

factories.value('online', 1);

factories.service("$local", function() {
  this.get = function() {};
  this.post = function() {};
  this.put = function() {};
  this.delete = function() {};
});

factories.service("$remote", function(online, $local, $http) {
  this.get    = $http.get
  this.post   = $http.post
  this.put    = $http.put
  this.delete = $http.delete
});

factories.service("$req", function(online, $remote, $local) {
  this.get    = online ? $remote.get    : $local.get;
  this.post   = online ? $remote.post   : $local.post;
  this.put    = online ? $remote.put    : $local.put;
  this.delete = online ? $remote.delete : $local.delete;
});

factories.factory('User', function($http, Allergy, $req, Emotion, Contact, Event) {
  
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
    return $req.get('/api/v1/users/'+ id).then(function(response) {
      return new Model(response.data)
    })
  }
  
  //NEEDS APPROVAL!
  Model.getUsers=function(){
    return $req.get('/api/v1/users/').then(function(response){
      return new Model(response.data);
    });
  }

  Model.getMe = function(uid) {
    return $req.get('/api/v1/me').then(function(response) {
      return new Model(response.data)
    })
  }

  
  Model.prototype.create = function() {
    _model = this;
    $req.post('/api/v1/users', _model).then(function(response) {
      _model.id = response.data.id;
      return _model;
    })
  }
  
  Model.prototype.delete = function(id) {
    $req.put('/api/v1/users/'+ (this.id || id)).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.save = function(id) {
    return $req.put('/api/v1/users/' + (this.id || id), this).then(function(response) {
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

factories.factory('Allergy', function($req) {
  var Model = function(opts) {
    opts || (opts = {});

    // TODO improve this with _underscore
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
  }
  Model.get = function(userId, id) {
    return $req.get('/api/v1/users/'+userId+'/allergies/'+id).then(function(response) {
      return new Model(response.data)
    })
  }
  
  Model.prototype.create = function() {
    _model = this
    return $req.post('/api/v1/allergies', _model).then(function(response) {
      _model.userId = response.data.userId;
      _model.id = response.data.id;
      console.log("created", _model, response.data.id)
      return new Model(_model);
    })
  }
  
  Model.prototype.delete = function() {
    return $req.delete('/api/v1/users/'+ this.userId +'/allergies/'+this.id).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.save = function(userId) {
    return $req.put('/api/v1/users/' + (this.userId || userId), this).then(function(response) {
      return response.data
    })
  }
  return Model;
});


factories.factory('Contact', function($req) {
  var Model = function(json) {
    this.name = json.name;
    this.surname = json.surname;
    this.description = json.description;
    this.kind = json.kind;
    this.picture = json.picture;
    this.username = json.username;
    this.telephone = json.telephone;
  }
  
  Model.prototype.create = function() {
    _model = this
    return $req.post('/api/v1/contacts', _model).then(function(response) {
      _model.id = response.data.id;
      return new Model(_model);
    })
  }

  Model.prototype.save = function(userId) {
    $req.put('/api/v1/users/' + (this.userId || userId) + '/contacts', this).then(function(response) {
      return response.data;
    })
  }

  Model.get = function(userId, id) {
    return $req.get('/api/v1/users/'+userId+'/contacts/'+id).then(function(response) {
      return new Model(response.data);
    })
  }
  
  return Model;
});




factories.factory('Emotion', function($req) {
  var Model = function(json) {
    this.description = json.description;
    this.emotion_type = json.emotion_type;
    this.location = json.location;
  }
  
  Model.prototype.create = function() {
    _model = this
    return $req.post('/api/v1/emotions', _model).then(function(response) {
      _model.userId = response.data.userId;
      return new Model(_model);
    })
  }
  
  return Model;
});

factories.factory('Event', function($req) {
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
      _model.userId = response.data.userId;
      _model.id = response.data.id;
      return new Model(_model);
    })
  }
  
  return Model;
});
factories.factory('Question', function($req) {
  var Model = function(opts) {
    opts || (opts = {});
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
    return Model;
  }

  Model.get = function(id) {
    return $req.get('/api/v1/questions/'+id).then(function(response) {
      return new Model(response.data)
    })
  }

  Model.query= function(){
  return $req.get('/api/v1/questions').then(function(response) {
      return response.data.map(function(question){
        return new Model(question);
      })
    })

  }

  Model.prototype.answer = function(answer){
    var _model = this;
    return $req.post('/api/v1/questions/'+this.id, answer).then(function(response){
      _model.answer = answer;
      return _model;
    });
  }
});