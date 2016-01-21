module.exports = function(serverIp, serverPort, databasePath) {
  'use strict';

  return require('./config/express.js')(databasePath).then(function(app) {;
    return app.listen(serverPort, serverIp, function () {
      console.log('Blog server running on http://' + serverIp + ':' + serverPort);
    });
  });
};