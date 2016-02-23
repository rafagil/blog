module.exports = function(conn, Sequelize) {
  'use strict';

  var Page = conn.define('Page', {
    title: {
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.TEXT
    }
  });

  return Page;
};