module.exports = function(conn, Sequelize) {
  'use strict';
  var Post = conn.define('Post', {
    title: {
      type: Sequelize.STRING
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
