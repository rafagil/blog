module.exports = function (app, enableStaticServer) {

	var controllers = app.controllers;

	app.get('/api/posts', controllers.post.list);
	app.get('/api/posts/:id', controllers.post.find);
	app.put('/api/posts/:id', controllers.post.update);
	app.post('/api/posts', controllers.post.add);
	
  if (enableStaticServer) {
    //All (Html 5 mode on angular):
    app.get('/*', function (req, res) {
      res.sendFile('index.html', {
        root: __dirname + '/../../front-end/'
      });
    });
  }
};