module.exports = function(conn, Sequelize) {
  'use strict';
  var User = conn.define('User', {
    fistName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    }
  });
  return User;
};
