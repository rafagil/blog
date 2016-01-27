angular.module('rafaelgil.blog').controller('PostController', ['$scope', '$stateParams', 'PostsService', 'EditorFactory', function ($scope, $stateParams, PostsService, EditorFactory) {
  'use strict';

  $scope.post = {};

  var init = function () {
    if ($stateParams.post) {
      $scope.post = $stateParams.post;
    } else {
      PostsService.find($stateParams.url).then(function (post) {
        $scope.post = post;
      });
    }
  };
  
  $scope.edit = function (post) {
    post.editor = EditorFactory.build('#post_' + post.id);
    post.editing = true;
  };

  $scope.save = function (post) {
    var tmpEditor = post.editor;
    delete post.editor;
    post.content = tmpEditor.getContent();
    PostsService.update(post).then(function () {
      tmpEditor.destroy();
      post.editing = false;
    });
  };

  init();
}]);