/* global describe, before, beforeEach, after, afterEach, it, __dirname */
/**
 * Test suite for the /posts resource.
 */
(function () {
  'use strict';
  var request = require('supertest');
  var sqlite3 = require('sqlite3');
  var should = require('should');

  describe('Post Tests', function () {
    var server;
    var tempDBPath;
    var db;
    this.timeout(5000);

    before(function() {
      tempDBPath = __dirname + '/db/posts.db';
      db = new sqlite3.Database(tempDBPath);
    });

    beforeEach(function (done) {
      db.run('DROP TABLE IF EXISTS POSTS');
      require(__dirname + '/../app')('localhost', '7357', tempDBPath).then(function(app) {
        server = app;
        done();
      });
    });

    after(function() {
      db.close();
    });

    it('Gets posts', function testGetsPosts(done) {
      request(server).get('/api/posts').expect(200, done);
    });

    it ('List Posts', function testListPosts(done) {
      var title = 'Test Post';
      var content = 'content';
      db.run("INSERT INTO POSTS (title, content, createdAt, updatedAt) VALUES ('"+ title + "','" + content + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)");
      request(server).get('/api/posts').then(function(response) {
        var post = JSON.parse(response.text);
        post.length.should.equal(1);
        post[0].title.should.equal(title);
        post[0].content.should.equal(content);
        done();
      });
    });

    it ('Forbids anonymous posting', function testAnonymousPost(done) {
      request(server).post('/api/posts').expect(401, done);
    });

    it ('Forbids anonymous editing', function testAnonymousPut(done) {
      request(server).put('/api/posts/1').expect(401, done);
    });

  })
} ());