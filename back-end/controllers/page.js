module.exports = function (app) {
  'use strict';

  var PageController = {};
  var PageRepo = app.repositories.pageRepository;

  PageController.list = function (req, resp) {
    if (req.query.url) {
      return PageRepo.findByURL(req.query.url).then(function (page) {
        resp.json(page);
      });
    } else {
      return PageRepo.list().then(function (pages) {
        resp.json(pages);
      });
    }
  };

  PageController.find = function (req, resp) {
    return PageRepo.find(req.params.id).then(function (page) {
      if (page) {
        resp.json(page);
      } else {
        resp.status(404).end();
      }
    });
  };

  PageController.update = function (req, resp) {
    return PageRepo.update(req.params.id, req.body).then(function (page) {
      if (page) {
        resp.json(page);
      } else {
        resp.status(404).end();
      }
    });
  };

  PageController.add = function (req, resp) {
    return PageRepo.create(req.body).then(function (page) {
      resp.json(page);
    });
  };

  return PageController;
};