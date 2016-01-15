module.exports = function () {
	'use strict';
	var Sequelize = require('sequelize');
	var conn = new Sequelize('BlogDB', 'admin', '1234', {
		dialect: 'sqlite',
		storage: './database/blog.db'
	});

	var models = {};

	var path = require('path').join(__dirname, '../models');
	require("fs").readdirSync(path).forEach(function (file) {
		var name = file.substring(0, file.indexOf('.'));
		models[name] = require("../models/" + file)(conn, Sequelize);
	});

	conn.sync();
	return models;
}