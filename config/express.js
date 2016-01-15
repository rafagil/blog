/* global process */
module.exports = function() {
  'use strict';
  var express = require('express');
  var load = require('express-load');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var session = require('express-session');
  var passport = require('passport');
  var sequelize = require('./sequelize');
  var app = express();

  app.set('view engine', 'ejs');
  app.set('views', './views');
  app.use(express.static('./public'));
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
  require('../routes/main')(app);

  return app;
};
