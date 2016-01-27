module.exports = function (app) {
  'use strict';
  var repo = {};
  var Post = app.models.post;
  var PostURL = app.models.posturl;

  var getUrlFromTitle = function(title) {
    return title.split(' ').join('-').toLowerCase();
  };

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
    return PostURL.create({url: getUrlFromTitle(title), PostId: postId});
  };

  repo.create = function(post) {
    post.url = getUrlFromTitle(post.title);
    return Post.create(post).then(function(post) {
      return repo.addUrl(post.title, post.id).then(function(url) { //TODO: move the PostURL handle to a sequelize hook
        return post; //It must return the post, not the URL!
      });
    });
  };

  repo.update = function(id, updatedPost) {
    return repo.findById(id).then(function(post) {
      if (post) {
        if (getUrlFromTitle(updatedPost.title) !== getUrlFromTitle(post.title)) { //TODO: move the PostURL handle to a sequelize hook
          return repo.addUrl(updatedPost.title, post.id).then(function() {
            updatedPost.url = getUrlFromTitle(updatedPost.title);
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