angular.module('rafaelgil.blog.services', ['restangular']).config([
	'RestangularProvider',
	function (RestangularProvider) {
		RestangularProvider.setBaseUrl('/api');
	}
]);