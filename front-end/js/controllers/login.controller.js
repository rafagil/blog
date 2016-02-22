(function () {
  'use strict';

  function LoginController($state, LoginService) {
    var vm = this;
    vm.setup = false;
    vm.user = {};

    vm.login = function () {
      LoginService.login(vm.user).then(function (user) {
        $state.go('posts');
      }).catch(function (e) {
        alert('Invalid User!');
      });
    };

    vm.createUser = function () {
      if (vm.user.password !== vm.user.passwordRetype) {
        alert('Both passwords must be the same!');
      } else {
        LoginService.createUser(vm.user).then(function () {
          vm.user.username = vm.user.email;
          vm.login();
        });
      }
    };

    var init = function () {
      LoginService.canSetup().then(function (can) {
        vm.setup = can;
      });
    };

    init();
  }

  angular.module('rafaelgil.blog')
    .controller('LoginController', ['$state', 'LoginService', LoginController]);
} ());