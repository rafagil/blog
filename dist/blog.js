angular.module('rafaelgil.blog').controller(['$state', 'PostsService', function ($state, PostsService) {
	'use strict';
	
	$state.posts = [];
	
	var init = function() {
		PostsService.list().then(function(posts) {
			$state.posts = posts;
		});
	};
	
	init();
}]);