module.exports = function(serverIp, serverPort, databasePath, silent) {
  'use strict';

  return require('./config/express.js')(databasePath).then(function(app) {;
    return app.listen(serverPort, serverIp, function () {
      if (!silent) {
        console.log('Blog server running on http://' + serverIp + ':' + serverPort);
      }
    });
  });
};