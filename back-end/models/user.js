module.exports = function (conn, Sequelize) {
  'use strict';
  var forge = require('node-forge');
  var md = forge.md.sha1.create();
  var User = conn.define('User', {
    indexes: [{
      unique: true,
      fields: ['email']
    }],
    fistName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING,
      set: function(val) {
        this.setDataValue('password', md.digest(val).toHex());
      }
    }
  });
  return User;
};
