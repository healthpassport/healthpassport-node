var api_server = "http://nicolaretina.local:3000"
var factories = angular.module('healthpass.factories', ['pouchdb']);

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
  this.getMe = function() {
    this.promise = User.getMe()
    return this.promise;
  }
  this.promise.then(function(value) {
      //alert("value I get")
      // alert(value)
      this.user = value;
    })
})

factories.value('cordovaValue', 0);

factories.factory("$sync", function(pouchdb) {
  PouchDB.enableAllDbs = true;
  var databases = {};

  return function(model) {
    if (!databases[model]) databases[model] = pouchdb.create(model);
    var db = databases[model];
    var localError = function(err) {console.log(err)}
    return {
      local: {
        upsert: function(doc) {
          if (!doc._id) doc._id = doc.id+""
          var json_doc = JSON.parse(JSON.stringify(doc));

          return db.get(doc._id).then(
            function(prev) {
              return db.put(json_doc, doc._id).then(function(result) {
                console.log("updating", doc._id, doc, result)
                return doc;
              },localError)
            },
            function(err) {
              if (err && err.status == 404) {
                console.log("not found")
                return db.put(json_doc).then(function(result) {
                  console.log("upserting", doc._id, result)
                  return doc;
                },localError)
              }
            }, localError);

        },
        create: function(doc) {
          return db.post(doc).then(function(result) {
            console.log("inserting", doc, doc, result)
            return doc;
          }, localError)
        },
        delete: function(_id) {
          console.log("before deletion", _id)
          return db.get(_id+"").then(function(doc) {
            return db.remove(doc).then(function(response) {
              console.log("deleting", doc, doc, response)
              return _id;
            }, localError);
          }, localError);
        },
        get: function(_id) {
          return db.get(_id+"").then(function(doc) {
            console.log("pdb getting: ", doc);
            return doc;
          }, localError)
        }
      },
      remote: {
        sync: function() {

        }
      }
    }
  };
});

factories.service("$remote", function($http) {
  this.get    = $http.get
  this.post   = $http.post
  this.put    = $http.put
  this.delete = $http.delete
  this.onlineOnly = function() {
    alert("You can not do this operation if you are not connected to the internet!")
  }
});

factories.factory("$req", function($remote) {
  return {
    isConnected: function () {
      // alert("isconnected")
      if (navigator && navigator.network && navigator.network.connection) {
              // alert("isconnected 2")
        return navigator.network.connection.type == Connection.NONE ? 0 : 1;
      } else return 1;
    },
    offline: function() {
      return !this.isConnected();
    }
  }
});

factories.factory('User', function($http, Allergy, $remote, Emotion, Contact, Event, $req, $sync, Question) {
  var sync = $sync('User')

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
    this.questions = opts.questions ? response_to_model(opts.questions, Question) : [];

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
    var promise;
    // alert("getMe")
    if ($req.offline()) {
      promise = sync.local.get('me').then(function(response) {
        console.log("response", response)
        if (response) return new Model(response);
        else return false;
      });
      promise.then(function(a){
        console.log("a")
      })
    } else {
      promise = $remote.get(api_server+'/api/v1/me').then(function(response) {
        // alert("asked server who I am")
        // alert(response)
        var model = new Model(response.data);
        model._id = "me";
        sync.local.upsert(model);
        return model;
      })
    }
    return promise;
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
    sync.local.upsert(this)
    return $remote.put(api_server+'/api/v1/users/' + (this.id || id), this).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.addAllergy = function(json) {
    var _user = this;
    var allergy = new Allergy(json);
    return allergy.create().then(function() {
      _user.allergies.push(allergy);
      sync.local.upsert(_user)
    })
  }
  
  Model.prototype.removeAllergy = function(allergy) {
    var _user = this;
    
    return allergy.delete().then(function() {
      var index;
      for (var i=0; i < _user.allergies.length; i++) {
        if (allergy.name == _user.allergies[i].name) {
          index = i;
          break
        }
      }
      console.log("allergies", index)
      _user.allergies.splice(index,1)
      sync.local.upsert(_user)
    });
  };
  
  
  Model.prototype.addEmotion = function(json) {
    var _user = this;
    var emotion = new Emotion(json);
    return emotion.create().then(function() {
      _user.emotions.push(emotion);
      sync.local.upsert(_user)
    })
  }
  
  Model.prototype.addEvent = function(json) {
    var _user = this;
    var _event = new Event(json);
    return _event.create().then(function() {
      _user.events.push(_event);
      sync.local.upsert(_user)
    })
  }

    Model.prototype.addContact = function(json) {
    var _user = this;
    var contact = new Contact(json);
    return contact.create().then(function(model) {
      console.log(model, _user);
      _user.contacts.push(model);
      sync.local.upsert(_user)
    })
  }

  return Model;
});

factories.factory('Allergy', function($remote, $sync, $req) {
  var sync = $sync('Allergy');
  var Model = function(opts) {
    opts || (opts = {});
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
    if (this.id) sync.local.upsert(this)
  }
  Model.get = function(userId, id) {
    return $remote.get(api_server+'/api/v1/users/'+userId+'/allergies/'+id).then(function(response) {
      return new Model(response.data)
    })
  }
  
  Model.prototype.create = function() {
    _model = this
    if ($req.offline()) return sync.local.create(this).then(function(a) { return new Model(_model)});
    return $remote.post(api_server+'/api/v1/allergies', _model).then(function(response) {
      _model.userId = response.data.userId;
      _model.id = response.data.id;
      return new Model(_model);
    })
  }
  
  Model.prototype.delete = function() {
    if ($req.offline()) return sync.local.delete(this.id || this._id)
    return $remote.delete(api_server+'/api/v1/users/'+ this.userId +'/allergies/'+this.id).then(function(response) {
      return response.data
    })
  }
  
  Model.prototype.save = function(userId) {
    return $remote.put(api_server+'/api/v1/users/' + (this.userId || userId), this).then(function(response) {
      return response.data
    })
  }
  return Model;
});


factories.factory('Contact', function($remote, $sync, $req) {
  var Model = function(opts) {
    opts || (opts = {});
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
  }
  
  Model.prototype.create = function() {
    _model = this;
    return $remote.post(api_server+'/api/v1/contacts', _model).then(function(response) {
      _model.id = response.data.id;
      return new Model(_model);
    })
  }

  Model.prototype.save = function(userId) {
    $remote.put(api_server+'/api/v1/users/' + (this.userId || userId) + '/contacts', this).then(function(response) {
      return response.data;
    })
  }

  Model.get = function(userId, id) {
    return $remote.get(api_server+'/api/v1/users/'+userId+'/contacts/'+id).then(function(response) {
      return new Model(response.data);
    })
  }
  
  return Model;
});

factories.factory('Emotion', function($remote, $sync, $req) {
  var sync = $sync('Emotion');
  var Model = function(opts) {
    opts || (opts = {});
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })

    if (this.id || this.id != undefined) sync.local.upsert(this)
  }
  
  Model.prototype.create = function() {
    _model = this
    if ($req.offline()) return sync.local.create(this).then(function(a) { return new Model(_model); });
    return $remote.post(api_server+'/api/v1/emotions', _model).then(function(response) {
      _model.userId = response.data.userId;
      return new Model(_model);
    })
  }
  
  return Model;
});

factories.factory('Event', function($remote, $sync, $req) {
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
factories.factory('Question', function($remote, $sync, $req) {

  var Model = function(opts) {
    opts || (opts = {});
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
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

/*
  Model.prototype.answer = function(answer){
    this.answer = answer;
    var _model = this;
    return $remote.post(api_server+'/api/v1/questions/'+this.id, answer).then(function(response){
      return _model;
    });
  }
  */

  Model.prototype.saveAnswer = function(answer){
    var _model = this;
    return $remote.post(api_server+'/api/v1/questions/'+this.id, {answer:answer}).then(function(response){
      _model.answer = answer;
      return _model;
    });
  }
  return Model;
});