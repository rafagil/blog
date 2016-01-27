/* global angular, Pen */
angular.module('rafaelgil.blog', ['ui.router', 'rafaelgil.blog.services']).config([
  '$httpProvider',
  '$stateProvider',
  '$locationProvider',
  '$urlRouterProvider',
  function ($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
    'use strict';

    var ua = window.navigator.userAgent;
    var isIE = ua.indexOf("MSIE ") >= 0;
    $locationProvider.html5Mode(!isIE);

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .state('posts', {
        url: '/',
        templateUrl: 'views/posts.html',
        controller: 'PostsController'
      })
      .state('post-view', {
        url: '/:url',
        params: {'post': null},
        templateUrl: 'views/post.html',
        controller: 'PostController'
      });

    $urlRouterProvider.otherwise('/');
    //$httpProvider.interceptors.push('ResponseStatusInterceptorService');
  }
]);