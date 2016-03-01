module.exports = function (app) {
  var repo = {};
  var Page = app.models.page;

  var getUrlFromTitle = function (title) {
    return title.split(' ').join('-').toLowerCase();
  };

  repo.list = function () {
    return Page.findAll({ attributes: ['id', 'url', 'title'] });
  };

  repo.find = function (id) {
    return Page.findById(id);
  };

  repo.findByURL = function (url) {
    return Page.find({ where: { url: url } }).then(function (page) {
      return page;
    });
  };

  repo.create = function (page) {
    if (!page.url) {
      page.url = getUrlFromTitle(page.title);
    }
    return Page.create(page);
  };

  repo.update = function (id, updatedPage) {
    return Page.findById(id).then(function (page) {
      if (page) {
        if (page.url === updatedPage.url && page.title !== updatedPage.title) {
          page.url = getUrlFromTitle(updatedPage.title);
        }
        return page.update(updatedPage);
      }
    });
  };

  return repo;
};