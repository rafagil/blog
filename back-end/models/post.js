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
    },
    url: {
      type: Sequelize.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Post.belongsTo(models.user);
        Post.belongsToMany(models.tag, {through: 'PostTag'});
      }
    }
  });

  return Post;
};