module.exports = function (app) {
  'use strict';
  var repo = {};
  var Post = app.models.post;
  var PostURL = app.models.posturl;

  repo.list = function () {
    return Post.findAll({ order: [['createdAt', 'DESC']] });
  };

  repo.findByURL = function(url) {
    return PostURL.find({where: {url : url}}).then(function(postUrl) {
      if (postUrl) {
        return postUrl.getPost().then(function(post) {
          return post;
        });
      }
      return null;
    });
  };

  repo.findById = function(id) {
    return Post.findById(id);
  };

  repo.addUrl = function(title, postId) {
    var postUrl = title.split(' ').join('-').toLowerCase();
    return PostURL.create({url: postUrl, PostId: postId});
  };

  repo.create = function(post) {
    return Post.create(post).then(function(post) {
      return repo.addUrl(post.title, post.id).then(function(url) {
        return post; //It must return the post, not the URL!
      });
    });
  };

  repo.update = function(id, updatedPost) {
    return repo.findById(id).then(function(post) {
      if (post) {
        if (updatedPost.title !== post.title) {
          return repo.addUrl(updatedPost.title, post.id).then(function() {
            return post.update(updatedPost);
          });
        } else {
          return post.update(updatedPost);
        }
      }
      return false;
    });
  };

  return repo;
};