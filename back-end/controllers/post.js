module.exports = function(app) {
	'use strict';
	var PostController = {};
	var Post = app.models.post;

	PostController.list = function(req, resp) {
		Post.findAll({order:[['createdAt', 'DESC']]}).then(function(posts) {
			resp.json(posts);
		});
	};

	PostController.find = function(req, resp) {
		Post.findById(req.params.id).then(function(post) {
			if (post) {
        resp.json(post);
      } else {
        resp.status(404).end();
      }
		});
	};

	PostController.add = function(req, resp) {
		Post.create(req.body).then(function(post) {
			resp.json(post);
		});
	};

	PostController.update = function(req, resp) {
		Post.findById(req.params.id).then(function(post) {
			if (post) {
        return post.update(req.body);
      } else {
        return false;
      }
		}).then(function(post) {
			if (post) {
        resp.json(post);
      } else {
        resp.status(404).end();
      }
		});
	};

	return PostController;
};