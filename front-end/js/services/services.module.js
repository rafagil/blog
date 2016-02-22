(function () {
  'use strict';

  function Config(RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
  }

  function RestFullResponse(Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setFullResponse(true);
    });
  }

  angular.module('rafaelgil.blog.services', ['restangular', 'ngSanitize'])
    .config(['RestangularProvider',Config])
    .factory('RestFullResponse', ['Restangular', RestFullResponse]);
} ());
