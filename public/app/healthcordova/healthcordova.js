angular.module('healthcordova', [])
.service('CordovaService', ['$document', '$q',
  function($document, $q) {

    var d = $q.defer(),
        resolved = false;

    var _this = this;
    this.ready = d.promise;

    document.addEventListener('deviceready', function() {
      console.log("message received")
      resolved = true;
      d.resolve(window.cordova);
    });

    setTimeout(function() {
      console.log("resolving")
      if (!resolved) {
        console.log("not resolved yet")
        if (window.cordova) d.resolve(window.cordova);
      }
    }, 3000);
}]);