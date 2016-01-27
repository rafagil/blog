angular.module('rafaelgil.blog').controller('LoginController', ['$scope', '$state', 'LoginService', function ($scope, $state, LoginService) {
  'use strict';

  $scope.setup = false;
  $scope.user = {};

  $scope.login = function() {
    LoginService.login($scope.user).then(function(user) {
      $state.go('posts');
    }).catch(function(e) {
      alert('Invalid User!');
    });
  };

  $scope.createUser = function() {
    if ($scope.user.password !== $scope.user.passwordRetype) {
      alert('Both passwords must be the same!');
    } else {
      LoginService.createUser($scope.user).then(function() {
        $scope.user.username = $scope.user.email;
        $scope.login();
      });
    }
  };

  var init = function() {
    LoginService.canSetup().then(function(can) {
      $scope.setup = can;
    });
  };

  init();
}]);