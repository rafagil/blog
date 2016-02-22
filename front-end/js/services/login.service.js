(function () {
  'use strict';

  function LoginService(Restangular, $q) {
    var service = {
      currentUser: null
    };

    service.login = function (user) {
      return Restangular.all('login').post(user).then(function (user) {
        service.currentUser = user;
      });
    };

    service.canSetup = function () {
      return Restangular.one('setup').get().then(function () {
        return true; // It will only get here if can setup returns 200
      });
    };

    service.createUser = function (user) {
      return Restangular.all('setup').all('users').post(user);
    };

    service.getCurrentUser = function () {
      var d = $q.defer();
      if (service.currentUser) {
        d.resolve(service.currentUser);
      } else {
        Restangular.all('users').one('current').get().then(function (user) {
          if (user) {
            service.currentUser = user;
            d.resolve(user);
          }
        });
      }
      return d.promise;
    };

    return service;
  }

  angular.module('rafaelgil.blog.services')
    .factory('LoginService', ['Restangular', '$q', LoginService]);

} ());



