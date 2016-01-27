angular.module('rafaelgil.blog.services').factory('LoginService', ['Restangular', function (Restangular) {
  'use strict';
  var service = {};

  service.login = function(user) {
    return Restangular.all('login').post(user);
  };

  service.canSetup = function() {
    return Restangular.one('setup').get().then(function() {
      return true; // It will only get here if can setup returns 200
    });
  };

  service.createUser = function(user) {
    return Restangular.all('setup').all('users').post(user);
  };

  return service;
}]);