module.exports = function(conn, Sequelize) {
  'use strict';
  var Post = conn.define('Post', {
    title: {
      type: Sequelize.STRING
    },
    summary: {
      type: Sequelize.TEXT
    },
    content: {
      type: Sequelize.TEXT
    },
    pubDate: {
      type: Sequelize.DATE
    }
    //Tags
  });
  return Post;
};
