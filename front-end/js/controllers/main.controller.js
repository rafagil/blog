(function () {
  'use strict';

  function MainController(MainService, PageService, LoginService, $state) {
    var main = this;

    main.viewPage = function (page) {
      PageService.find(page.url).then(function (post) {
        $state.go('main.page', { page: post, url: page.url }); //Pre-loading the page here prevents opening a page without any content.
      });
    };

    MainService.getPages().then(function (pages) {
      main.pages = pages;
    });
    
    LoginService.getCurrentUser().then(function (user) {
      main.loggedIn = !!user;
      main.currentUser = user;
    });
  }

  angular.module('rafaelgil.blog')
    .controller('MainController', ['MainService', 'PageService', 'LoginService', '$state', MainController]);

} ());