module.exports = function (app) {
  'use strict';
  var repo = {};
  var User = app.models.user;

  repo.adminExists = function () {
    return User.findAll().then(function (users) {
      if (users && users.length) {
        return true;
      }
      return false;
    });
  };

  repo.create = function (user) {
    return User.create(user);
  };

  return repo;
};