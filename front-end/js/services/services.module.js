angular.module('rafaelgil.blog.services', ['restangular', 'ngSanitize']).config([
  'RestangularProvider',
  function (RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
  }
]).factory('RestFullResponse', ['Restangular', function (Restangular) {
  return Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setFullResponse(true);
  });
}]);