module.exports = function(models) {
  'use strict';
  var forge = require('node-forge');
  var md = forge.md.sha1.create();
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  
  passport.use(new LocalStrategy(function(username, password, done) {
    var shaPass = md.digest(password).toHex();
    
    models.user.find({where:{email: username}}).then(function(user) {
      if (user && shaPass === user.password) {
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid username/password'});
      }
    });
  }));
  
  passport.serializeUser(function(user, done) {
    return done(null, user.id);
  });
  
  passport.deserializeUser(function(userId, done) {
    models.user.findById(userId).then(function(user) {
      return done(null, user);
    });
  });
};