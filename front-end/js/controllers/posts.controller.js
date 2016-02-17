/* global angular, Pen */
angular.module('rafaelgil.blog').controller('PostsController', ['$scope', '$state', 'PostsService', 'EditorFactory', 'LoginService', function ($scope, $state, PostsService, EditorFactory, LoginService) {
  'use strict';

  $scope.paginationInfo = {
    page: 1,
    pageSize: 5
  };

  $scope.canGoBack = false;
  $scope.posts = [];
  var summaryEditor;
  var contentEditor;

  var list = function () {
    PostsService.list($scope.paginationInfo).then(function (result) {
      $scope.canGoBack = ($scope.paginationInfo.page) * $scope.paginationInfo.pageSize <= result.totalResults;
      $scope.posts = result.posts;
      if (!result.posts.length) {
        LoginService.canSetup().then(function (can) {
          if (can) {
            $state.go('login');
          }
        });
      }
      window.scrollTo(0,0);
    });
  };

  $scope.create = function () {
    $scope.showAdd = true;
    summaryEditor = EditorFactory.build('#newSummaryEditor');
    contentEditor = EditorFactory.build('#newContentEditor');
  };

  $scope.insert = function () {
    var post = {
      title: $scope.newTitle,
      content: contentEditor.getContent(),
      summary: summaryEditor.getContent()
    };
    PostsService.create(post).then(function () {
      $scope.init();
      $scope.showAdd = false;
      summaryEditor.destroy();
      contentEditor.destroy();
    }); //needs tags
  };

  $scope.edit = function (post) {
    post.editor = EditorFactory.build('#post_' + post.id);
    post.editing = true;
  };

  $scope.save = function (post) {
    var tmpEditor = post.editor;
    delete post.editor;
    post.summary = tmpEditor.getContent();
    PostsService.update(post).then(function () {
      tmpEditor.destroy();
      post.editing = false;
    });
  };

  $scope.viewPost = function (post) {
    PostsService.find(post.url).then(function (post) {
      $state.go('post-view', { post: post, url: post.url }); //Pre-loading the post here prevents opening a page without any content.
    });
  };

  $scope.olderPosts = function () {
    if ($scope.canGoBack) {
      $scope.paginationInfo.page++;
      list();
    }
  };

  $scope.newerPosts = function () {
    if ($scope.paginationInfo.page > 1) {
      $scope.paginationInfo.page--;
      list();
    }
  };

  $scope.init = function () {
    $scope.summaryPlaceholder = "Summary goes here!";
    $scope.contentPlaceholder = "Content goes here!";
    $scope.newTitle = "";
    LoginService.getCurrentUser().then(function (user) {
      $scope.loggedIn = !!user;
    });
    list();
  };

  $scope.init();
}]);
