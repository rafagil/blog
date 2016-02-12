module.exports = function (app) {
  'use strict';
  var PostController = {};
  var PostRepo = app.repositories.postRepository;

  PostController.list = function (req, resp) {
    if (req.query.url) {
      return PostRepo.findByURL(req.query.url).then(function(posts) {
        resp.json(posts);
      });
    } else {
      return PostRepo.list().then(function (posts) {
        resp.json(posts);
      });
    }
  };

  PostController.find = function (req, resp) {
    return PostRepo.findById(req.params.id).then(function (post) {
      if (post) {
        resp.json(post);
      } else {
        resp.status(404).end();
      }
    });
  };

  PostController.add = function (req, resp) {
    return PostRepo.create(req.body).then(function (post) {
      resp.json(post);
    });
  };

  PostController.update = function (req, resp) {
    return PostRepo.update(req.params.id, req.body).then(function (post) {
      if (post) {
        resp.json(post);
      } else {
        resp.status(404).end();
      }
    });
  };

  return PostController;
};