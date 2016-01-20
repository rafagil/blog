module.exports = function(models) {
  'use strict';
  var forge = require('node-forge');
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  
  passport.use(new LocalStrategy(function(username, password, done) {
    var md = forge.md.sha1.create();
    md.update(password);
    var shaPass = md.digest().toHex();
    
    return models.user.find({where:{email: username}}).then(function(user) {
      if (user && shaPass === user.password) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
  
  passport.serializeUser(function(user, done) {
    return done(null, user.id);
  });
  
  passport.deserializeUser(function(userId, done) {
    return models.user.findById(userId).then(function(user) {
      return done(null, user);
    });
  });
};