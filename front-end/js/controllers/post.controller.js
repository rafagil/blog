angular.module('rafaelgil.blog').controller('PostController', ['$scope', '$stateParams', 'PostsService', function ($scope, $stateParams, PostsService) {
  'use strict';

  $scope.post = {};

  var init = function () {
    if ($stateParams.post) {
      $scope.post = $stateParams.post;
    } else {
      PostsService.find($stateParams.url).then(function (post) {
        $scope.post = post;
      });
    }
  };

  init();
}]);