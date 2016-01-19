/* global process */
module.exports = function() {
  'use strict';
  var environment = process.env.NODE_ENV;
  var express = require('express');
  var load = require('express-load');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var session = require('express-session');
  var passport = require('passport');
  var sequelize = require('./sequelize');
  var app = express();
  
  //Enables static web server only for development purposes.
  //For production, you'll probably use Nginx or Apache with reverse proxy instead.
  var enableStaticServer = environment === 'development'; 

  app.set('view engine', 'ejs');
  app.set('views', './views');
  if (enableStaticServer) {
    app.use(express.static('../front-end'));
  }
  
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.handleError = function(err, res) {
    console.log(err);
    res.status('500').end();
  };

  app.use(cookieParser());
  app.use(session({
    secret: 'SessaoSecretaBlog',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.models = sequelize();
  load('controllers').into(app);

  //require('./passport')();
  require('../routes/main')(app, enableStaticServer);

  return app;
};
