(function () {
  'use strict';

  function Config(RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
  }

  function RestFullResponse(Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setFullResponse(true);
    });
  }

  angular.module('rafaelgil.blog.services', ['restangular', 'ngSanitize'])
    .config(['RestangularProvider',Config])
    .factory('RestFullResponse', ['Restangular', RestFullResponse]);
} ());

(function () {
  'use strict';

  //TODO: This should be a directive
  function EditorFactory() {
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
  }

  angular.module('rafaelgil.blog.services')
    .factory('EditorFactory', EditorFactory);

} ());
(function () {
  'use strict';

  function LoginService(Restangular, $q) {
    var service = {
      currentUser: null
    };

    service.login = function (user) {
      return Restangular.all('login').post(user).then(function (user) {
        service.currentUser = user;
      });
    };

    service.canSetup = function () {
      return Restangular.one('setup').get().then(function () {
        return true; // It will only get here if can setup returns 200
      });
    };

    service.createUser = function (user) {
      return Restangular.all('setup').all('users').post(user);
    };

    service.getCurrentUser = function () {
      var d = $q.defer();
      if (service.currentUser) {
        d.resolve(service.currentUser);
      } else {
        Restangular.all('users').one('current').get().then(function (user) {
          if (user) {
            service.currentUser = user;
            d.resolve(user);
          }
        });
      }
      return d.promise;
    };

    return service;
  }

  angular.module('rafaelgil.blog.services')
    .factory('LoginService', ['Restangular', '$q', LoginService]);

} ());




(function () {
  'use strict';

  function MainService(PageService, $q) {
    var service = {
      pages: []
    };

    service.getPages = function() {
      if (service.pages.length) {
        return $q(function(resolve) {
          return service.pages;
        });
      } else {
        return PageService.list().then(function(pages) {
          service.pages = pages.plain();
          return service.pages;
        });
      }
    };

    return service;
  }

  angular.module('rafaelgil.blog.services')
    .factory('MainService', ['PageService', '$q', MainService]);
} ());
(function () {
  'use strict';

  function PageService(Restangular, $sce) {
    var service = {};

    var trust = function (post) {
      $sce.trustAsHtml(post.summary);
      $sce.trustAsHtml(post.contents);
      return post;
    };

    service.list = function () {
      return Restangular.all('pages').getList().then(function (pages) {
        return pages;
      });
    };

    service.find = function (url) {
      return Restangular.one('pages').get({ url: url }).then(function (page) {
        return trust(page);
      });
    };

    service.create = function (page) {
      return Restangular.all('pages').post(page);
    };

    service.update = function (page) {
      return page.put();
    };

    return service;
  }

  angular.module('rafaelgil.blog.services')
    .factory('PageService', ['Restangular', '$sce', PageService]);
} ());
(function () {
  'use strict';

  function PostsService(Restangular, RestFullResponse, $sce) {
    var service = {};

    var trust = function (post) {
      $sce.trustAsHtml(post.summary);
      $sce.trustAsHtml(post.contents);
      return post;
    };

    service.list = function (paginationInfo) {
      return RestFullResponse.all('posts').getList({}, paginationInfo).then(function (response) {
        var posts = response.data;
        posts.forEach(function (post) {
          trust(post);
        });
        return {
          posts: posts,
          totalResults: parseInt(response.headers('totalResults'), 10)
        };
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
  }

  angular.module('rafaelgil.blog.services')
    .factory('PostsService', ['Restangular', 'RestFullResponse', '$sce', PostsService]);
} ());