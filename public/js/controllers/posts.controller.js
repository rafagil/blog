angular.module('rafaelgil.blog').controller('PostsController', ['$scope', 'PostsService', function ($scope, PostsService) {
	'use strict';
	
	$scope.posts = [];
	
	var init = function() {
		PostsService.list().then(function(posts) {
			$scope.posts = posts;
		});
	};
	
	init();
}]);