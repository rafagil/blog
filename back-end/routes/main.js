/* global __dirname */
module.exports = function (app, enableStaticServer) {
  'use strict';

  var passport = require('passport');
	var controllers = app.controllers;

  var checkAuth = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).end();
    }
  };

  //Posts:
	app.get('/api/posts', controllers.post.list);
	app.get('/api/posts/:id', controllers.post.find);
  app.get('/api/posts/image/:id', controllers.post.getImage);
	app.put('/api/posts/:id', checkAuth, controllers.post.update);
	app.post('/api/posts', checkAuth, controllers.post.add);

  //Pages:
  app.get('/api/pages', controllers.page.list);
  app.get('/api/pages/:id', controllers.page.find);
  app.put('/api/pages/:id', checkAuth, controllers.page.update);
  app.post('/api/pages', checkAuth, controllers.page.add);

  //Login:
  app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.status(200).end();
  });
  app.get('/api/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.status(200).end();
  });
  app.get('/api/users/current', controllers.user.current);

  //Static:
  if (enableStaticServer) {
    //All (Html 5 mode on angular):
    app.get('/*', function (req, res) {
      res.sendFile('index.html', {
        root: __dirname + '/../../front-end/'
      });
    });
  }
};