angular.module('rafaelgil.blog.services').factory('PostsService', ['Restangular', function (Restangular) {
	'use strict';
	var service = {};
	
	service.list = function() {
		return Restangular.all('posts').getList();
	};
  
  service.create = function(post) {
    return Restangular.all('posts').post(post);
  };
	
	return service;
}]);