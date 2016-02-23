(function () {
  'use strict';

  function MainService(PageService, $q) {
    var service = {
      pages: []
    };

    service.getPages = function() {
      if (service.pages.length) {
        return $q(function(resolve) {
          return service.pages;
        });
      } else {
        return PageService.list().then(function(pages) {
          service.pages = pages.plain();
          return service.pages;
        });
      }
    };

    return service;
  }

  angular.module('rafaelgil.blog.services')
    .factory('MainService', ['PageService', '$q', MainService]);
} ());