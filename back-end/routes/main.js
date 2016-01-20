/* global __dirname */
module.exports = function (app, enableStaticServer) {
  'use strict';

	var controllers = app.controllers;
  
  var checkAuth = function(req, res, next) {
    if (req.isAuthenticated() || req.session.user) {
      req.user = req.session.user;
      return next();
    } else {
      res.status(401).json('Unauthorized');
    }
  };

	app.get('/api/posts', controllers.post.list);
	app.get('/api/posts/:id', controllers.post.find);
	app.put('/api/posts/:id', checkAuth, controllers.post.update);
	app.post('/api/posts', checkAuth, controllers.post.add);

  if (enableStaticServer) {
    //All (Html 5 mode on angular):
    app.get('/*', function (req, res) {
      res.sendFile('index.html', {
        root: __dirname + '/../../front-end/'
      });
    });
  }
};