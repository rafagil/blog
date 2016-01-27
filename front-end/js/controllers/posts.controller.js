/* global angular, Pen */
angular.module('rafaelgil.blog').controller('PostsController', ['$scope', '$state', 'PostsService', 'EditorFactory', 'LoginService', function ($scope, $state, PostsService, EditorFactory, LoginService) {
  'use strict';

  $scope.posts = [];
  var summaryEditor;
  var contentEditor;

  var list = function () {
    PostsService.list().then(function (posts) {
      $scope.posts = posts;

      if (!posts.length) {
        LoginService.canSetup().then(function(can) {
          if (can) {
            $state.go('login');
          }
        });
      }
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

  $scope.viewPost = function(post) {
    PostsService.find(post.url).then(function (post) {
      $state.go('post-view', {post: post, url: post.url}); //Pre-loading the post here prevents opening a page without any content.
    });
  };

  $scope.init = function () {
    $scope.summaryPlaceholder = "Summary goes here!";
    $scope.contentPlaceholder = "Content goes here!";
    $scope.newTitle = "";
    list();
  };

  $scope.init();
}]);
