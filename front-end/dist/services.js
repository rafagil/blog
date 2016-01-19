angular.module('rafaelgil.blog.services', ['restangular']).config([
	'RestangularProvider',
	function (RestangularProvider) {
		RestangularProvider.setBaseUrl('/api');
	}
]);
angular.module('rafaelgil.blog.services').factory('PostsService', ['Restangular', function (Restangular) {
	'use strict';
	var service = {};

	service.list = function() {
		return Restangular.all('posts').getList();
	};

  service.create = function(post) {
    return Restangular.all('posts').post(post);
  };

	service.update = function(post) {
		return post.put();
	};

	return service;
}]);
