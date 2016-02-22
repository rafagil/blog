(function () {
  'use strict';

  function PostController($stateParams, PostsService, EditorFactory) {
    var vm = this;
    vm.post = {};

    var init = function () {
      if ($stateParams.post) {
        vm.post = $stateParams.post;
      } else {
        PostsService.find($stateParams.url).then(function (post) {
          vm.post = post;
        });
      }
    };

    vm.edit = function (post) {
      post.editor = EditorFactory.build('#post_' + post.id);
      post.editing = true;
    };

    vm.save = function (post) {
      var tmpEditor = post.editor;
      delete post.editor;
      post.content = tmpEditor.getContent();
      PostsService.update(post).then(function () {
        tmpEditor.destroy();
        post.editing = false;
      });
    };

    init();
  }

  angular.module('rafaelgil.blog')
    .controller('PostController', ['$stateParams', 'PostsService', 'EditorFactory', PostController]);

} ());
