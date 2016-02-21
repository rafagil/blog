/* global process, __dirname */
(function() {
  'use strict';
  var serverIp = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
  var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;
  require('./app')(serverIp, serverPort, './database/blog.db');
}());
