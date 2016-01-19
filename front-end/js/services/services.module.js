angular.module('rafaelgil.blog.services', ['restangular', 'ngSanitize']).config([
	'RestangularProvider',
	function (RestangularProvider) {
		RestangularProvider.setBaseUrl('/api');
	}
]);