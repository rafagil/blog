/* global angular, Pen */
(function () {
  'use strict';

  function Config($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
    'use strict';

    var ua = window.navigator.userAgent;
    var isIE = ua.indexOf("MSIE ") >= 0;
    $locationProvider.html5Mode(!isIE);

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginController as vm'
      })
      .state('main', {
        abstract: true,
        controller: 'MainController as main',
        templateUrl: 'views/main.html'
      })
      .state('main.posts', {
        url: '/',
        templateUrl: 'views/posts.html',
        controller: 'PostsController as vm'
      })
      .state('main.post-view', {
        url: '/:url',
        params: { 'post': null },
        templateUrl: 'views/post.html',
        controller: 'PostController as vm'
      })
      .state('main.page', {
        url: '/pages/:url',
        parent: 'main',
        params: { 'page': null, 'parentCtrl': null },
        templateUrl: 'views/page.html',
        controller: 'PageController as vm'
      });

    $urlRouterProvider.otherwise('/');
  }

  angular.module('rafaelgil.blog', ['ui.router', 'rafaelgil.blog.services'])
    .config(['$httpProvider', '$stateProvider', '$locationProvider', '$urlRouterProvider', Config]);

} ());
