angular.module('rafaelgil.blog').controller('PostsController', ['$scope', 'PostsService', function($scope, PostsService) {
  'use strict';

  $scope.posts = [];
  var editor;

  var list = function() {
    PostsService.list().then(function(posts) {
      $scope.posts = posts;
    });
  };

  $scope.create = function() {
    $scope.showAdd = true;
    if (!editor) {
      editor = new Pen({
        editor: document.querySelector('#create'),
        list: ['bold', 'italic', 'underline']
      });
    } else {
      editor.rebuild();
    }
  };

  $scope.insert = function() {
    PostsService.create({
      title: $scope.newTitle,
      content: editor.getContent(),
      summary: editor.getContent()
    }).then(function() {
      list();
      $scope.showAdd = false;
      editor.destroy();
    }); //needs summary, tags and stuff like that
  };

  $scope.edit = function(post) {
    post.editor = new Pen('#post_' + post.id);
    post.editing = true;
  };

  $scope.save = function(post) {
    var tmpEditor = post.editor;
    delete post.editor;
    post.content = tmpEditor.getContent();
    post.summary = post.content;
    PostsService.update(post).then(function() {
      tmpEditor.destroy();
      post.editing = false;
    });
  };

  var init = function() {
    list();
  };

  init();
}]);
