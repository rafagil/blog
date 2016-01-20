/* global __dirname */
module.exports = function (app, enableStaticServer) {
  'use strict';

  var passport = require('passport');
	var controllers = app.controllers;
  
  var checkAuth = function(req, res, next) {
    if (req.isAuthenticated() || req.session.user) {
      return next();
    } else {
      res.status(401).end();
    }
  };

	app.get('/api/posts', controllers.post.list);
	app.get('/api/posts/:id', controllers.post.find);
	app.put('/api/posts/:id', checkAuth, controllers.post.update);
	app.post('/api/posts', checkAuth, controllers.post.add);

  app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.status(200).end();
  });
  app.get('/api/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.status(200).end();
  });

  if (enableStaticServer) {
    //All (Html 5 mode on angular):
    app.get('/*', function (req, res) {
      res.sendFile('index.html', {
        root: __dirname + '/../../front-end/'
      });
    });
  }
};