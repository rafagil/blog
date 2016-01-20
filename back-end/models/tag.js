module.exports = function(conn, Sequelize) {
  'use strict';
  var Tag = conn.define('Tag', {
    name: {
      type: Sequelize.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Tag.belongsToMany(models.post, {through: 'PostTag'});
      }
    }
  });

  return Tag;
};
