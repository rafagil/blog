module.exports = function (app) {
  'use strict';
  var repo = {};
  var Post = app.models.post;
  var PostURL = app.models.posturl;
  var User = app.models.user;

  var getUrlFromTitle = function (title) {
    return title.split(' ').join('-').toLowerCase();
  };

  repo.list = function (page, pageSize) {
    var params = {
      order: [['createdAt', 'DESC']],
      include: [User]
    };

    if (page && pageSize) {
      params.limit = pageSize;
      params.offset = (page - 1) * pageSize;
    }

    return Post.findAndCountAll(params).then(function (result) {
      return {
        posts: result.rows,
        count: result.count
      };
    });
  };

  repo.findByURL = function (url) {
    var params = {
      include: [{
        model: PostURL,
        where: { url: url },
      }, User]
    };

    return Post.find(params).then(function (post) {
      return post;
    });
  };

  repo.findById = function (id) {
    return Post.findById(id);
  };

  repo.addUrl = function (title, postId) {
    return PostURL.create({ url: getUrlFromTitle(title), PostId: postId });
  };

  repo.create = function (post) {
    post.url = getUrlFromTitle(post.title);
    return Post.create(post).then(function (post) {
      return repo.addUrl(post.title, post.id).then(function (url) { //TODO: move the PostURL handle to a sequelize hook
        return post; //It must return the post, not the URL!
      });
    });
  };

  repo.update = function (id, updatedPost) {
    return repo.findById(id).then(function (post) {
      if (post) {
        if (getUrlFromTitle(updatedPost.title) !== getUrlFromTitle(post.title)) { //TODO: move the PostURL handle to a sequelize hook
          return repo.addUrl(updatedPost.title, post.id).then(function () {
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