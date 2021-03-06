module.exports = function (conn, Sequelize) {
  'use strict';
  var forge = require('node-forge');
  var User = conn.define('User', {
    indexes: [{
      unique: true,
      fields: ['email']
    }],
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      set: function(val) {
        var md = forge.md.sha1.create();
        md.update(val);
        this.setDataValue('password', md.digest().toHex());
      }
    }
  });
  return User;
};
