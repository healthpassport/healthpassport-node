/* healthpass.factories.js
 *
 * This file contains all the Models used in the app:
 * Allergy, Contact, User, Emotion, Event..
 *
 * Each model has a constructor that can be used:
 * var model = new ModelName(json)
 *
 * For example: 
 * var user = new User({name:"Nicola Greco"})
 *
 * Each model has its own CRUD methods
 * user.save() // updates user
 * user.delete() // delete user
 * user.create() // create user
 *
 * When saving a model $sync ensures that it is saved offline
 *
 */

var api_server = "http://healthpassport.herokuapp.com"
angular.module('healthpass.factories', [
  'healthpass.sync' // Synchronisation helpers for online/offline database
])

// Me: Promise with current user
.service('Me', function(User) {
  var _this = this;
  // Default empty user before request
  this.user = new User();

  // Getting user
  this.promise = User.getMe()
  this.promise.then(function(value) {
      // reset the user
      _this.user = value;
    })

  // Get another promise if requested
  this.getMe = function() {
    this.promise = User.getMe()
    this.promise.then(function(value) {
      _this.user = value
    })
    return this.promise;
  }

})

// cordovaValue: Ensure that the platform is web and not cordova
.value('cordovaValue', 0)

// User: model of user
.factory('User', function($http, Allergy, Picture, $remote, Emotion, Contact, Event, $req, $sync, Question) {

  // Get offline database
  var sync = $sync('User')

  // Functional programming hack: to each Model in the Ajax response json, map their corrispective Model,
  // so that the javascript object is now instance of Model (e.g. a allergy in json becomes new Allergy(json))
  var response_to_model = function (json, Model) {
    return json.map(function(element) { return new Model(element) });
  }
  
  // Model constructor
  var Model = function(opts) {
    opts || (opts = {});

    // Functional programming hack: for each field in the json, create a field in the instance
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })

    this.allergies = opts.allergies ? response_to_model(opts.allergies, Allergy) : [];
    this.emotions = opts.emotions ? response_to_model(opts.emotions, Emotion) : [];
    this.events = opts.emotions ? response_to_model(opts.events, Event) : [];
    this.contacts = opts.contacts ? response_to_model(opts.contacts, Contact) : [];
    this.questions = opts.questions ? response_to_model(opts.questions, Question) : [];
    this.pictures = opts.pictures ? response_to_model(opts.pictures, Picture) : [];

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
    // Get the offline version if offline
    if ($req.offline()) {
      promise = sync.local.get('me').then(function(response) {
        console.log("response", response)
        if (response) return new Model(response);
        else return false;
      });
    }
    // Load from server if connected
    else {
      promise = $remote.get(api_server+'/api/v1/me').then(function(response) {
        var model = new Model(response.data);
        model._id = "me";

        // Update offline database
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
    // update the local database with the changes
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
  
  
  Model.prototype.addEmotion = function(json, localurl) {
    var _user = this;
    var emotion = new Emotion(json);
    if (localurl) emotion.localurl = localurl;

    return emotion.create().then(function() {
      _user.emotions.push(emotion);
      sync.local.upsert(_user)
    });

  }

  Model.prototype.addPicture = function(localurl) {
    var _user = this;
    var pic = new Picture({localurl: localurl});

    return pic.create().then(function() {
      _user.pictures.push(pic);
      sync.local.upsert(_user)
    });

  }
  
  Model.prototype.addEvent = function(json) {
    var _user = this;
    var _event = new Event(json);

    return _event.create().then(function() {
      _user.events.push(_event);
      sync.local.upsert(_user)
    });

  }

    Model.prototype.addContact = function(json) {
    var _user = this;
    var contact = new Contact(json);

    return contact.create().then(function(model) {
      console.log(model, _user);
      _user.contacts.push(model);
      sync.local.upsert(_user)
    });

  }

  return Model;
})

// All the other models follow what happens in User
.factory('Allergy', function($remote, $sync, $req) {
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
})
.factory('Uploader', function($q) {
  return {
    uploadPhoto: function (url, imageURI, params, success) {
      var deferred = $q.defer();

      var options = new FileUploadOptions(); 
      options.chunkedMode = false;
      options.fileKey = "pic"; 
      var imagefilename = imageURI; 
      options.fileName = imagefilename; 
      options.mimeType = "image/jpeg"; 
      options.params = params;
      var authdata = localStorage.getItem('authdata')
      options.headers = {'Authorization': authdata}
      console.log(options.headers)
      var ft = new FileTransfer();

      ft.upload(
        imageURI,
        url,
        function(r) {
          response = {data: JSON.parse(r.response)}
          deferred.resolve(response);
        },
        function(error) {
          var r;
          switch (error.code) {  
           case FileTransferError.FILE_NOT_FOUND_ERR: 
            r = "Photo file not found"; 
            break; 
           case FileTransferError.INVALID_URL_ERR: 
            r = "Bad Photo URL"; 
            break; 
           case FileTransferError.CONNECTION_ERR: 
            r = "Connection error"; 
            break; 
          } 
          deferred.reject(r);
        },
        options
      );

      return deferred.promise;
    }
  }
})
.factory('Picture', function($remote, $sync, $req, $q, Uploader) {

  var Model = function(opts) {
    opts || (opts = {});
    var _this = this;
    Object.keys(opts).map(function(key) {
       _this[key] = opts[key];
    })
  }
  Model.prototype.create = function() {
    _model = this;
    return Uploader.uploadPhoto(api_server+'/api/v1/pictures', this.localurl, _model).then(function(response) {
      _model.id = response.data.id;
      return new Model(_model);
    })
  }

  return Model;
})
.factory('Contact', function($remote, $sync, $req) {
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
})

.factory('Emotion', function($remote, $sync, $req, Uploader) {

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

    console.log("the current emotion",this.localurl)
    var promise;
    if (this.localurl) {
      promise = Uploader.uploadPhoto(api_server+'/api/v1/emotions', this.localurl, _model).then(function(response) {

        _model.id = response.data.id;
        return new Model(_model);
      })
    } else {
      promise = $remote.post(api_server+'/api/v1/emotions', _model).then(function(response) {
        _model.id = response.data.id;
        return new Model(_model);
      });
    }
    return promise;
  }
  
  return Model;
})
.factory('Patient', function($remote, $sync, $req) {
  return {
    disability_level: function(value) {
      if (+value == 1) {
        return "Low"
      } else
      if (+value == 2) {
        return "Medium"
      } else
      if (+value == 3) {
        return "High"
      } else {
        return false;
      }
    },
    understanding_level: function(value) {
      if (+value == 1) {
        return "Easily"
      } else
      if (+value == 2) {
        return "Moderate"
      } else
      if (+value == 3) {
        return "Very difficult"
      } else {
        return false;
      }
    },
    communication_type: function(value) {
      if (+value == 1) {
        return "Read and write"
      } else
      if (+value == 2) {
        return "Talking and visual"
      } else
      if (+value == 3) {
        return "Only visual"
      } else
      if (+value == 4) {
        return "Need external help"
      } else {
        return false;
      }
    }
  }
})
.factory('Event', function($remote, $sync, $req) {
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
})
.factory('Question', function($remote, $sync, $req) {

  // Model contructor
  var Model = function(opts) {

    // Overloading, I can pass an object or nothing
    opts || (opts = {});
    var _this = this;

    // Functional programming hack: for each field in the json, create a field in the instance
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

  Model.prototype.saveAnswer = function(answer){
    var _model = this;
    return $remote.post(api_server+'/api/v1/questions/'+this.id, {answer:answer}).then(function(response){
      _model.answer = answer;
      return _model;
    });
  }
  return Model;
})
.factory('Position', function($req) {
  var Position = {
    create: function(lat, lon) {
      if (req.offline()) return;
      return $http.post(api_server+'/api/v1/positions', {lat:lat, lon:lon});
    }
  }
})