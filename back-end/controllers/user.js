module.exports = function(app) {
  'use strict';
  var UserController = {};

  UserController.current = function(req, resp) {
    resp.json(req.user);
  };

  return UserController;
};