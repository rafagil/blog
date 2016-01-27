/* global process */
module.exports = function (databasePath) {
  'use strict';
  var q = require('q');
  var Sequelize = require('sequelize');
  var environment = process.env.NODE_ENV;
  var conn = new Sequelize('BlogDB', 'admin', '1234', {
    dialect: 'sqlite',
    storage: databasePath,
    logging: environment === 'development' ? console.log : false
  });


  var models = {};

  //Reads the models path and import all models:
  var path = require('path').join(__dirname, '../models');
  require("fs").readdirSync(path).forEach(function (file) {
    var name = file.substring(0, file.indexOf('.'));
    models[name] = require("../models/" + file)(conn, Sequelize);
  });

  // Call associate method of all models, so every model will have access to all models.
  Object.keys(models).forEach(function (modelName) {
    if ("associate" in models[modelName]) {
      models[modelName].associate(models);
    }
  });

  var d = q.defer();
  conn.sync().then(function() {
    d.resolve(models);
  });

  return d.promise;
};