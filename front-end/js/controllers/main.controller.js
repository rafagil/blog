(function () {
  'use strict';

  function MainController(MainService, PageService, LoginService, $state) {
    var main = this;

    main.loadPages = function (refresh) {
      MainService.getPages(refresh).then(function (pages) {
        main.pages = pages;
      });
    };

    main.viewPage = function (page) {
      PageService.find(page.url).then(function (page) {
        $state.go('main.page', { page: page, url: page.url, parentCtrl: main }); //Pre-loading the page here prevents opening a page without any content.
        window.scrollTo(0, 0);
      });
    };

    main.savePage = function () {
      PageService.create({ title: main.newPageTitle }).then(function (page) {
        main.addingPage = false;
        main.newPageTitle = '';
        main.loadPages(true);
      });
    };
    
    main.logout = function () {
      LoginService.logout().then(function () {
        main.loggedIn = false;
        main.currentUser = null;
      });
    };

    LoginService.getCurrentUser().then(function (user) {
      main.loggedIn = !!user;
      main.currentUser = user;
    });

    main.loadPages(false);
  }

  angular.module('rafaelgil.blog')
    .controller('MainController', ['MainService', 'PageService', 'LoginService', '$state', MainController]);

} ());