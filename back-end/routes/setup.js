module.exports = function(app) {
  'use strict';
  var controllers = app.controllers;

  app.get('/api/setup', controllers.setup.canSetup);
  app.post('/api/setup/users', controllers.setup.createUser);
};