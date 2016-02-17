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
      var page = parseInt(req.headers.page, 10);
      var pageSize = parseInt(req.headers.pagesize, 10);
      return PostRepo.list(page, pageSize).then(function (result) {
        resp.append('totalResults', result.count);
        resp.json(result.posts);
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
    req.body.userId = req.user.id;
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