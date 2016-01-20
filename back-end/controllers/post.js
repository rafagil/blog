module.exports = function(app) {
	'use strict';
	var PostController = {};
	var Post = app.models.post;
	
	PostController.list = function(req, resp) {
		Post.findAll({order:[['createdAt', 'DESC']]}).then(function(posts) {
			resp.json(posts);
		})
	};
	
	PostController.find = function(req, resp) {
		Post.findById(req.params.id).then(function(post) {
			resp.json(post);
		});
	};
	
	PostController.add = function(req, resp) {
		Post.create(req.body).then(function(post) {
			resp.json(post);
		});
	};
	
	PostController.update = function(req, resp) {
		Post.findById(req.params.id).then(function(post) {
			return post.update(req.body);
		}).then(function(post) {
			resp.json(post);
		});
	};
	
	return PostController;	
};