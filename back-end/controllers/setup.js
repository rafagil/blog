module.exports = function(app) {
  'use strict';
  var ctrl = {};
  var UserRepo = app.repositories.userRepository;

  ctrl.canSetup = function(req, res) {
    UserRepo.adminExists().then(function(exists) {
      if (exists) {
        res.status(401).end();
      } else {
        res.status(200).end();
      }
    });
  };

  ctrl.createUser = function(req, res) {
    UserRepo.adminExists().then(function(exists) {
      if (exists) {
        res.status(401).end();
      } else {
        UserRepo.create(req.body).then(function(user) {
          res.status(201).json(user);
        }).catch(function(e) {
          res.status(403).json(e);
        });
      }
    });

  };

  return ctrl;
};