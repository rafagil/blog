/* global describe, before, beforeEach, after, afterEach, it, __dirname */
/**
 * Test suite for the /setup resource.
 */
(function () {
  'use strict';
  var request = require('supertest');
  var sqlite3 = require('sqlite3');
  var should = require('should');

  describe('Setup tests', function () {
    var server;
    var tempDBPath;
    var db;
    this.timeout(45000); // raspberry pi

    before(function () {
      tempDBPath = __dirname + '/db/setup.db';
      db = new sqlite3.Database(tempDBPath);
    });

    beforeEach(function (done) {
      db.run('DROP TABLE IF EXISTS USERS', function() {
        require(__dirname + '/../app')('localhost', '7357', tempDBPath, true).then(function (app) {
          server = app;
          done();
        });
      });
    });

    afterEach(function(done) {
      server.close(function(err) {
        done();
      });
    });

    after(function () {
      db.close();
    });

    var createUser = function(callback) {
      db.run("INSERT INTO USERS (email, password, createdAt, updatedAt) VALUES('a@mail.com', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", callback);
    };

    it('Allows setup if there is no user on the database', function(done) {
      request(server).get('/api/setup').expect(200, done);
    });

    it('Forbids setup if there is an user', function(done) {
      createUser(function() {
        request(server).get('/api/setup').expect(401, done);
      });
    });

    it('Allows create an user if there is no user', function(done) {
      request(server).post('/api/setup/users').send({email: 'a@mail.com', password:'1234'}).expect(201, done);
    });

    it('Returns the newly created user after insert', function(done) {
      var userObj = {email: 'a@mail.com', password:'1234'};
      var hashPassword = '7110eda4d09e062aa5e4a390b0a572ac0d2c0220'; //SHA1
      request(server).post('/api/setup/users').send(userObj).then(function(response) {
        should(response.text).not.equal('');
        var user = JSON.parse(response.text);
        user.should.have.property('email');
        user.should.have.property('password');
        user.email.should.equal(userObj.email);
        user.password.should.equal(hashPassword);
        done();
      });
    });

    it('Forbids create an user if there is an user on database', function(done) {
      createUser(function() {
        request(server).post('/api/setup/users', {email: 'a@mail.com', password:'1234'}).expect(401, done);
      });
    });

    it('Forbids create an user with no email', function(done) {
      request(server).post('/api/setup/users', {password:'1234'}).expect(403, done);
    });

    it('Forbids create an user with no password', function(done) {
      request(server).post('/api/setup/users', {email: 'a@mail.com'}).expect(403, done);
    });

  });
}());