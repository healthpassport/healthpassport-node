var healthpass = angular.module('healthpass', ['healthpass.routes', 'healthpass.factories', 'healthpass.controllers']);

healthpass.service('CordovaService', ['$document', '$q',
  function($document, $q) {

    var d = $q.defer(),
        resolved = false;

    var _this = this;
    this.ready = d.promise;

    document.addEventListener('deviceready', function() {
      resolved = true;
      d.resolve(window.cordova);
    });

    setTimeout(function() {
      if (!resolved) {
        if (window.cordova) d.resolve(window.cordova);
        else d.reject()
      }
    }, 3000);
}]);

healthpass.filter('pad', function() {
  return function(num) {
    if(num < 10) return '0' + num;
    else return num;
  };
});

healthpass.controller('HomeController', function($scope, Me, $req, cordovaValue, $location, $window) {
});

healthpass.controller('LoginController', function($scope, Me, $req, cordovaValue, $location) {
});


healthpass.controller('WebcamController', function($scope) {

  $scope.nStre
});

function DateFormat($scope, $timeout) {
  $scope.format = 'M/d/yy h:mm a';
  $scope.date = new Date();
  $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var tick = function() {
    $scope.date = new Date();
    $timeout(tick, 1000);
   };

  $timeout(tick, 1000);
}

healthpass.controller('AddEventController', function($scope, Me, $location) {
  $scope.saveEvent = function(data) {
    $scope.me.addEvent(data).then(function() {  
      $location.path("/events");
    });
  };
});

healthpass.controller('SignupController', function($scope) {});

healthpass.controller('ContactsController', function($scope, $location, Me) {
});

healthpass.controller('EventsController', function($scope, $location, Me) {
});

healthpass.controller('QuestionsController',function($scope, Question){
  $scope.questions=[];
  Question.query().then(function(questions){
    $scope.questions=questions;
  })
});

healthpass.controller('QuestionController',function($scope, Question){
  $scope.answer=function(answer){
    $scope.question.answer(answer).then(function(){

    })
  }
})

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
  console.log("allergy controller")
  $scope.data={};

  $scope.presetAllergies=[{name: 'peanuts'}, {name: 'milk'},{name: 'dust'},{name: 'banana'}].map(function(one) { one.active = 0; return one;});
  var preset_allergies = $scope.presetAllergies.map(function(allergy) {return angular.copy(allergy.name);});
  $scope.presetAllergies=[{name: 'peanuts'}, {name: 'milk'},{name: 'dust'},{name: 'banana'}];
  $scope.notSelectedAllergies = [];
  
  var preset_allergies = $scope.presetAllergies.map(function(allergy) {return angular.copy(allergy.name)});
  
  Me.promise.then(function() {
    
    // iterate through all the existing allergies
    for (var i = 0; i < $scope.presetAllergies.length; i++) {
      var current_allergy = angular.copy($scope.presetAllergies[i]);

      // iterate through all the user allergies
      var found = false;
      for (var j = 0; j < $scope.me.allergies.length; j++) {
        var current_user_allergy = $scope.me.allergies[j];
        if (current_allergy.name == current_user_allergy.name) {
          found = true;
          break;
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
healthpass.controller('PassportEditController', function($scope) {
  $scope.saveMe = function(me) {
    me.save(me._id).then(function() {
      console.log("saved");
    })
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