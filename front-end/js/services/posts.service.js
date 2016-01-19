angular.module('rafaelgil.blog.services').factory('PostsService', ['Restangular', '$sce', function (Restangular, $sce) {
	'use strict';
	var service = {};

	service.list = function() {
		return Restangular.all('posts').getList().then(function(posts) {
      posts.forEach(function(post) {
        $sce.trustAsHtml(post.summary);
        $sce.trustAsHtml(post.contents);
      });
      return posts;
    });
	};

  service.create = function(post) {
    return Restangular.all('posts').post(post);
  };

	service.update = function(post) {
		return post.put();
	};

	return service;
}]);
