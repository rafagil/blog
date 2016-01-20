angular.module('rafaelgil.blog').controller('LoginController', ['$scope', '$state', 'LoginService', function ($scope, $state, LoginService) {
  'use strict';
  
  $scope.login = function() {
    LoginService.login($scope.user).then(function(user) {
      $state.go('posts');
    }).catch(function(e) {
      alert('Invalid User!');
    });
  };
  
}]);