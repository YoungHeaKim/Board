const Article = require('../models/article');

module.exports = {
  removeArticle(data) {
    return Article.remove(data);
  },
  createArticle(data) {
    return Article.create({
      title: data.title,
      writer: data.writer,
      thumbnail: data.thumbnail,
      content: data.content
    })
  },
  findArticleById(data) {
    return Article.findById(data)
  },
  updateTitleAndDescription(Id, data) {
    return Article.findByIdAndUpdate(Id, {
      title: data.title,
      thumbnail: data.thumbnail,
      content: data.content
    })
  },
  findAllArticle(data) {
    return Article.find(data);
  }
}