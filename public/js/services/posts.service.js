angular.module('rafaelgil.blog.services').factory('PostsService', ['Restangular', function (Restangular) {
	'use strict';
	var service = {};
	
	service.list = function() {
		return Restangular.all('posts').getList();
	};
	
	return service;
}]);