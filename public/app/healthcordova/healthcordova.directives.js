angular.module('healthcordova.directives', [])
.directive('camera', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {

      elm.on('click', function() {

        // Start camera
        navigator.camera.getPicture(
          function(imageURI) {
            scope.$apply(function() {
                ctrl.$setViewValue(imageURI);
            });
          },
          function(err) {
            ctrl.$setValidity('error', false);
          },
          {
            quality: 50, 
            destinationType: Camera.DestinationType.FILE_URI
          });

      });

  }
};
});