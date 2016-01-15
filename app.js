(function() {
  'use strict';

  var serverIp = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
  var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;

  var app = require('./config/express.js')();
  app.listen(serverPort, serverIp, function() {
    console.log('Process ' + process.pid + ' is listening to all incoming requests');
  });


}());
