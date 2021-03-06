(function () {
  'use strict';

  function PostsService(Restangular, RestFullResponse, $sce) {
    var service = {};

    var trust = function (post) {
      $sce.trustAsHtml(post.summary);
      $sce.trustAsHtml(post.contents);
      return post;
    };

    service.list = function (paginationInfo) {
      return RestFullResponse.all('posts').getList({}, paginationInfo).then(function (response) {
        var posts = response.data;
        posts.forEach(function (post) {
          trust(post);
        });
        return {
          posts: posts,
          totalResults: parseInt(response.headers('totalResults'), 10)
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
    
    service.getImage = function (post) {
      return Restangular.all('posts').one('image', post.id).get().then(function(postImage) {
        post.image = postImage.image;
      });
    };

    return service;
  }

  angular.module('rafaelgil.blog.services')
    .factory('PostsService', ['Restangular', 'RestFullResponse', '$sce', PostsService]);
} ());