angular.module('rafaelgil.blog').controller('PostsController', ['$scope', 'PostsService', function ($scope, PostsService) {
  'use strict';

  $scope.posts = [];
  var editor;

  $scope.create = function () {
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

  $scope.insert = function () {
    PostsService.create({
      title: 'Needs a title here',
      content: editor._prevContent,
      summary: editor._prevContent
    }); //needs summary, tags and stuff like that
    editor.destroy();
  };

  var init = function () {
    PostsService.list().then(function (posts) {
      $scope.posts = posts;
    });
  };

  init();
}]);