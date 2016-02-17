angular.module('rafaelgil.blog.services', ['restangular', 'ngSanitize']).config([
	'RestangularProvider',
	function (RestangularProvider) {
		RestangularProvider.setBaseUrl('/api');
	}
]);
angular.module('rafaelgil.blog.services').factory('EditorFactory', [function () {
  'use strict';
  var factory = {};

  factory.build = function (selector) {
    return new Pen({
      editor: document.querySelector(selector),
      list: [
        'insertimage', 'blockquote', 'h2', 'h3', 'p', 'code', 'insertorderedlist', 'insertunorderedlist', 'inserthorizontalrule',
        'indent', 'outdent', 'bold', 'italic', 'underline', 'createlink'
      ]
    });
  };

  return factory;
}]);
angular.module('rafaelgil.blog.services').factory('LoginService', ['Restangular', '$q', function (Restangular, $q) {
  'use strict';
  var service = {
    currentUser: null
  };

  service.login = function(user) {
    return Restangular.all('login').post(user).then(function(user) {
      service.currentUser = user;
    });
  };

  service.canSetup = function() {
    return Restangular.one('setup').get().then(function() {
      return true; // It will only get here if can setup returns 200
    });
  };

  service.createUser = function(user) {
    return Restangular.all('setup').all('users').post(user);
  };

  service.getCurrentUser = function() {
    var d = $q.defer();
    if (service.currentUser) {
      d.resolve(service.currentUser);
    } else {
      Restangular.all('users').one('current').get().then(function(user) {
        if (user) {
          service.currentUser = user;
          d.resolve(user);
        }
      });
    }
    return d.promise;
  };

  return service;
}]);
angular.module('rafaelgil.blog.services').factory('PostsService', ['Restangular', '$sce', function (Restangular, $sce) {
  'use strict';
  var service = {};

  var trust = function (post) {
    $sce.trustAsHtml(post.summary);
    $sce.trustAsHtml(post.contents);
    return post;
  };

  service.list = function () {
    return Restangular.all('posts').getList().then(function (posts) {
      posts.forEach(function (post) {
        trust(post);
      });
      return posts;
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

  return service;
}]);
