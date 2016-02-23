(function () {
  'use strict';

  function PageService(Restangular, $sce) {
    var service = {};

    var trust = function (post) {
      $sce.trustAsHtml(post.summary);
      $sce.trustAsHtml(post.contents);
      return post;
    };

    service.list = function () {
      return Restangular.all('pages').getList().then(function (pages) {
        return pages;
      });
    };

    service.find = function (url) {
      return Restangular.one('pages').get({ url: url }).then(function (page) {
        return trust(page);
      });
    };

    service.create = function (page) {
      return Restangular.all('pages').post(page);
    };

    service.update = function (page) {
      return page.put();
    };

    return service;
  }

  angular.module('rafaelgil.blog.services')
    .factory('PageService', ['Restangular', '$sce', PageService]);
} ());