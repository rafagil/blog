angular.module('rafaelgil.blog.services').factory('LoginService', ['Restangular', function (Restangular) {
  'use strict';
  var service = {};
  
  service.login = function(user) {
    return Restangular.all('login').post(user);
  };
  
  return service;
}]);