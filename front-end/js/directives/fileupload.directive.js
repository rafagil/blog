(function () {
  'use strict';

  function FileUpload($parse) {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function () {
          var reader = new FileReader();

          reader.addEventListener("load", function () {
            scope.$apply(function () {
              modelSetter(scope, reader.result);
            })
          }, false);

          reader.readAsDataURL(element[0].files[0]);
        });
      }
    };
  }

  angular.module('rafaelgil.blog')
    .directive('fileModel', ['$parse', FileUpload]);
} ());