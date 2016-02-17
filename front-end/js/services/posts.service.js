angular.module('rafaelgil.blog.services').factory('PostsService', ['Restangular', '$sce', function (Restangular, $sce) {
  'use strict';
  var service = {};

  var trust = function (post) {
    $sce.trustAsHtml(post.summary);
    $sce.trustAsHtml(post.contents);
    return post;
  };

  service.list = function (paginationInfo) {
    return Restangular.all('posts').getList({}, paginationInfo).then(function (posts) {
      posts.forEach(function (post) {
        trust(post);
      });
      return {
        posts: posts,
        totalResults: 3
      };
    });
  };

  service.find = function (url) {
    return Restangular.one('posts').get({ url: url }).then(function (post) {
      return trust(post);
    });
  };


  service.create = function (post) {
    return Restangular.all('posts').post(post);
  };

  service.update = function (post) {
    return post.put();
  };

  return service;
}]);
