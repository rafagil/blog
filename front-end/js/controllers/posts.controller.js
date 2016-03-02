/* global angular, Pen */
(function () {
  'use strict';

  function PostsController($state, PostsService, EditorFactory, LoginService) {
    var vm = this;

    vm.paginationInfo = {
      page: 1,
      pageSize: 5
    };

    vm.canGoBack = false;
    vm.posts = [];
    vm.currentUser = "";
    var summaryEditor;
    var contentEditor;

    var list = function () {
      PostsService.list(vm.paginationInfo).then(function (result) {
        vm.canGoBack = (vm.paginationInfo.page) * vm.paginationInfo.pageSize <= result.totalResults;
        vm.posts = result.posts;
        if (!result.posts.length) {
          LoginService.canSetup().then(function (can) {
            if (can) {
              $state.go('login');
            }
          });
        } else {
          vm.posts.forEach(function(post) {
            PostsService.getImage(post);
          });
        }
        window.scrollTo(0, 0);
      });
    };

    vm.create = function () {
      vm.showAdd = true;
      summaryEditor = EditorFactory.build('#newSummaryEditor');
      contentEditor = EditorFactory.build('#newContentEditor');
    };

    vm.insert = function () {
      var post = {
        title: vm.newTitle,
        content: contentEditor.getContent(),
        summary: summaryEditor.getContent()
      };
      PostsService.create(post).then(function () {
        vm.init();
        vm.showAdd = false;
        summaryEditor.destroy();
        contentEditor.destroy();
      }); //needs tags
    };

    vm.edit = function (post) {
      post.editor = EditorFactory.build('#post_' + post.id);
      post.editing = true;
    };

    vm.save = function (post) {
      var tmpEditor = post.editor;
      delete post.editor;
      post.summary = tmpEditor.getContent();
      PostsService.update(post).then(function () {
        tmpEditor.destroy();
        post.editing = false;
      });
    };

    vm.viewPost = function (post) {
      PostsService.find(post.url).then(function (post) {
        $state.go('main.post-view', { post: post, url: post.url }); //Pre-loading the post here prevents opening a page without any content.
        window.scrollTo(0, 0);
      });
    };

    vm.olderPosts = function () {
      if (vm.canGoBack) {
        vm.paginationInfo.page++;
        list();
      }
    };

    vm.newerPosts = function () {
      if (vm.paginationInfo.page > 1) {
        vm.paginationInfo.page--;
        list();
      }
    };
    
    vm.init = function () {
      vm.summaryPlaceholder = "Summary goes here!";
      vm.contentPlaceholder = "Content goes here!";
      vm.newTitle = "";
      list();
    };

    vm.init();
  }

  angular.module('rafaelgil.blog')
    .controller('PostsController', ['$state', 'PostsService', 'EditorFactory', 'LoginService', PostsController]);
} ());

