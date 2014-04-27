/*
 * healthpass.sync.js
 *
 * Synchronise online/offline and handling connections
 *
 */

angular.module('healthpass.sync', ['pouchdb'])

/* 
 * $sync: Factory that synchronize online and offline
 *
 * It is based on PouchDB (http://pouchdb.com)
 *
 * $sync has to be initialised for the database that we want to populate
 * $sync('Allergy') will create a database for allergy if doesn't exist yet
 * and will return a singleton with .local and .remote
 *
 * $sync('Allergy').local has .upsert(doc), .create(doc), .delete(doc), .get(id)
 * these methods will affect the local memory
 * $sync('Allergy').remote has helpers to synchronise local data with remote data
 * 
 */
.factory("$sync", function(pouchdb) {
  PouchDB.enableAllDbs = true;

  // HashMap with all databases
  var databases = {};

  // $sync can be used as $sync(databaseName)
  return function(model) {
    
    // if no database, create it and add it to map
    if (!databases[model])
      databases[model] = pouchdb.create(model);

    // Retrieve DB
    var db = databases[model];

    // Helper function to store errors
    var localError = function(err) {console.log(err)}

    // Return a singleton with local and remote functions
    return {
      local: {

        // Update document or insert if does not exist on the offline database
        upsert: function(doc) {
          // make sure that PouchDB ._id exists and it's a string
          if (!doc._id) doc._id = doc.id+""

          var json_doc = JSON.parse(JSON.stringify(doc));

          // We return promises
          return db.get(doc._id).then(
            // on success:
            function(prev) {

              // Update
              return db.put(json_doc, doc._id).then(function(result) {
                console.log("updating", doc._id, doc, result)
                return doc;
              },localError);

            },

            // on error:
            function(err) {

              // If doesnt exist
              if (err && err.status == 404) {
                console.log("not found")

                // Insert document
                return db.put(json_doc).then(function(result) {
                  console.log("upserting", doc._id, result)
                  return doc;
                },localError);

              }
            }, localError);

        },

        // Create document on the offline database and return promise
        create: function(doc) {
          return db.post(doc).then(function(result) {
            console.log("inserting", doc, doc, result)
            return doc;
          }, localError)

        },

        // Delete document from the offline database and return promise
        delete: function(_id) {

          console.log("before deletion", _id)
          return db.get(_id+"").then(function(doc) {
            return db.remove(doc).then(function(response) {
              console.log("deleting", doc, doc, response)
              return _id;
            }, localError);
          }, localError);

        },

        // Get a document from the offline database
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
})

// $remote: Facade for $http, with extra method, initially useful for debugging
// left here for future implementations
.service("$remote", function($http) {
  this.get    = $http.get
  this.post   = $http.post
  this.put    = $http.put
  this.delete = $http.delete
  this.onlineOnly = function() {
    alert("You can not do this operation if you are not connected to the internet!")
  }
})

// $req: initally handling requests online and offline as fallback, now checks if 
// user is connected or offline
.factory("$req", function($remote) {
  return {

    isConnected: function () {
      
      // window.navigator exists in cordova
      if (navigator && navigator.network && navigator.network.connection) {
              // alert("isconnected 2")
        return navigator.network.connection.type == Connection.NONE ? 0 : 1;
      }
      // if it is not on cordova, it is on the web and it must be connected, no?
      else {
        return 1;
      }
    },

    offline: function() {
      return !this.isConnected();
    }
  }
})