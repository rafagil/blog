(function () {
  'use strict';

  function PageController($stateParams, PageService, EditorFactory) {
    var vm = this;
    vm.page = {};

    var init = function () {
      if ($stateParams.page) {
        vm.page = $stateParams.page;
      } else {
        PageService.find($stateParams.url).then(function (page) {
          vm.page = page;
        });
      }
    };

    vm.edit = function (page) {
      page.editor = EditorFactory.build('#page');
      page.editing = true;
    };

    vm.save = function (page) {
      var tmpEditor = page.editor;
      delete page.editor;
      page.content = tmpEditor.getContent();
      PageService.update(page).then(function () {
        tmpEditor.destroy();
        page.editing = false;
      });
    };

    init();
  }

  angular.module('rafaelgil.blog')
    .controller('PageController', ['$stateParams', 'PageService', 'EditorFactory', PageController]);

} ());
