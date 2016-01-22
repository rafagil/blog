module.exports = function(conn, Sequelize) {
  'use strict';
  var PostURL = conn.define('PostURL', {
    indexes: [{
      unique: true,
      fields: ['url']
    }],
    url: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        PostURL.belongsTo(models.post);
      }
    }
  });

  return PostURL;
};