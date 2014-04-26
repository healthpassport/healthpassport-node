var healthcordova = angular.module('healthcordova', ['healthpass', 'ngCookies'])

healthcordova.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $httpProvider.responseInterceptors.push('httpInterceptor');
});

healthcordova.factory('httpInterceptor', function httpInterceptor ($q, $window, $location) {
  return function (promise) {
      var success = function (response) {
          return response;
      };

      var error = function (response) {
          if (response.status === 401) {
              $location.path('/login');
          }

          return $q.reject(response);
      };

      return promise.then(success, error);
  };
});

healthcordova.controller('CordovaMainController', function(cordovaValue, $scope, Me, $location, $rootScope, Auth) {

  // alert("CordovaMainController")
  
  Me.promise.then(function(user) {
    if (!user) $location.path("/login")
    $rootScope.me = user;
  }, function(err) {
    // alert("error when you")
    console.log(err)
    $location.path("/login")
  });
  
  $scope.isRoute = function(route) {
    return $location.path() == route;
  }

  $scope.logout = function() {
    Auth.clearCredentials()
    $location.path('/login')
  }

});

healthcordova.factory('Auth', function(Base64, $http, $cookieStore) {
   $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');
   return {
    setCredentials: function (username, password) {
      var encoded = Base64.encode(username + ':' + password);
      $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
      $cookieStore.put('authdata', encoded);
    },
    clearCredentials: function () {
      document.execCommand("ClearAuthenticationCache");
      $cookieStore.remove('authdata');
      $http.defaults.headers.common.Authorization = 'Basic ';
    }
   }
})

healthcordova.controller('LoginController', function($scope, Me, Auth, $rootScope, $location) {
  $scope.login = function(data) {
    Auth.setCredentials(data.username, data.password);

    Me.getMe().then(function(user) {
      // alert("Logging in")
      console.log(user)
      if (!user) $location.path("/login")
      $rootScope.me = user;
      $location.path("/")
    }, function(err) {
      console.log(err)
      // alert("Password or username not correct")
      $scope.data = {}
    });

    // alert("logging in")
  }
});

healthcordova.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
});