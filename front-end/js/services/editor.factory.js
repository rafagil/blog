(function () {
  'use strict';

  //TODO: This should be a directive
  function EditorFactory() {
    var factory = {};

    factory.build = function (selector) {
      return new Pen({
        editor: document.querySelector(selector),
        list: [
          'insertimage', 'blockquote', 'h2', 'h3', 'p', 'code', 'insertorderedlist', 'insertunorderedlist', 'inserthorizontalrule',
          'indent', 'outdent', 'bold', 'italic', 'underline', 'createlink'
        ]
      });
    };

    return factory;
  }

  angular.module('rafaelgil.blog.services')
    .factory('EditorFactory', EditorFactory);

} ());