module.exports = function () {
  'use strict';
  var Sequelize = require('sequelize');
  var conn = new Sequelize('BlogDB', 'admin', '1234', {
    dialect: 'sqlite',
    storage: './database/blog.db'
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

  conn.sync();
  return models;
};