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
    this.timeout(45000); // raspberry pi

    before(function () {
      tempDBPath = __dirname + '/db/posts.db';
      db = new sqlite3.Database(tempDBPath);
    });

    var execute = function (tables, callback) {
      var table = tables.pop();
      if (table) {
        db.run('drop table if exists ' + table, function () {
          execute(tables, callback);
        });
      } else {
        callback();
      }
    };

    var deleteTables = function (callback) {
      var tables = ['posts', 'users', 'posturls'];
      execute(tables, callback);
    };

    beforeEach(function (done) {
      deleteTables(function () {
        require(__dirname + '/../app')('localhost', '7357', tempDBPath, true).then(function (app) {
          server = app;
          done();
        });
      });
    });

    afterEach(function (done) {
      server.close(function (err) {
        done();
      });
    });

    after(function () {
      db.close();
    });

    var createPost = function (title, content, callback) {
      db.run("INSERT INTO POSTS (title, content, createdAt, updatedAt) VALUES ('" + title + "','" + content + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", function (post) {
        db.run("INSERT INTO POSTURLS (url, postid, createdAt, updatedAt) VALUES ('" + title.split(' ').join('-').toLowerCase() + "', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", callback);
      });
    };

    var login = function (execute) {
      db.run("INSERT INTO USERS (email, password, createdAt, updatedAt) VALUES('a@mail.com', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", function () {
        request(server)
          .post('/api/login')
          .send({ username: 'a@mail.com', password: '1234' })
          .end(function (err, res) {
            var cookies = res.headers['set-cookie'].pop().split(';')[0];
            execute(cookies, res.statusCode);
          });
      });
    };

    it('Gets posts', function testGetsPosts(done) {
      request(server).get('/api/posts').expect(200, done);
    });

    it('List Posts', function testListPosts(done) {
      var title = 'Test Post';
      var content = 'content';
      createPost(title, content, function () {
        request(server).get('/api/posts').then(function (response) {
          var post = JSON.parse(response.text);
          post.length.should.equal(1);
          post[0].title.should.equal(title);
          post[0].content.should.equal(content);
          done();
        });
      });
    });

    it('Forbids anonymous posting', function testAnonymousPost(done) {
      request(server).post('/api/posts').expect(401, done);
    });

    it('Forbids anonymous editing', function testAnonymousPut(done) {
      request(server).put('/api/posts/any-title').expect(401, done);
    });

    it('Returns 404 if a post is not found', function test404(done) {
      request(server).get('/api/posts/nonexistent-title').expect(404, done);
    });

    it('Can login', function testLogin(done) {
      login(function (cookies, status) {
        status.should.equal(200);
        done();
      });
    });

    it('Creates a post', function (done) {
      var post = {
        title: 'Post Title',
        content: 'Post Contents'
      };
      login(function (cookies) {
        var req = request(server).post('/api/posts');
        req.cookies = cookies;
        req.send(post).expect(200, done);
      });
    });

    it('Updates a post', function (done) {
      createPost('Test Post', 'content', function () {
        var updatedPost = {
          title: 'New Post Title',
          content: 'Post Contents'
        };
        login(function (cookies) {
          var req = request(server).put('/api/posts/' + 1);
          req.cookies = cookies;
          req.send(updatedPost).expect(200, done);
        });
      });
    });

    it('creates a new url when title is updated, and both works', function (done) {
      createPost('Test Post', 'content', function () {

        var updatedPost = {
          title: 'New Post Title',
          content: 'Post Contents'
        };

        var validateResponse = function (response) {
          should(response.statusCode).equal(200);
          should(response.text).not.equal('');
          var post = JSON.parse(response.text);
          post.title.should.equal(updatedPost.title);
          post.content.should.equal(updatedPost.content);
        };

        login(function (cookies) {

          var updateReq = request(server).put('/api/posts/' + 1);
          updateReq.cookies = cookies;
          updateReq.send(updatedPost).then(function (response) {
            var req = request(server).get('/api/posts/').query({ url: 'test-post' });
            req.cookies = cookies;
            req.send().then(function (response) {
              validateResponse(response);

              var req2 = request(server).get('/api/posts/').query({ url: 'new-post-title' });
              req2.cookies = cookies;
              req2.send().then(function (response) {
                validateResponse(response);
                done();
              });
            });
          });
        });
      });
    });

  });
} ());