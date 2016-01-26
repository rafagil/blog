module.exports = function (app) {
  'use strict';
  var repo = {};
  var Post = app.models.post;
  var PostURL = app.models.posturl;

  repo.list = function () {
    return Post.findAll({ order: [['createdAt', 'DESC']] });
  };

  repo.findByURL = function(url) {
    return PostURL.findAll().then(function(postUrl) {
      console.log(postUrl);
      return postUrl.post;
    });
  };

  repo.findById = function(id) {
    return Post.findById(id);
  };

  repo.create = function(post) {
    return Post.create(post).then(function(post) {
      var postUrl = post.title.replace(' ', '-').toLowerCase();
      PostURL.create({url: postUrl, PostId: post.id}).then(function(url) {
        console.log('posturl:');
        console.log(url);
        return post; //It must return the post, not the URL!
      });
    });
  };

  return repo;
};