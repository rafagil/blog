angular.module('rafaelgil.blog.services').factory('EditorFactory', [function () {
  'use strict';
  var factory = {};
  
  factory.build = function (selector) {
    return new Pen({
      editor: document.querySelector(selector),
      list: ['bold', 'italic', 'underline']
    });
  };

  return factory;
}]);