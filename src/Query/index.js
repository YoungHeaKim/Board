const { ...AuthQuery } = require('./AuthQuery');
const { ...ArticleQuery } = require('./ArticleQuery');

module.exports = {
  ...AuthQuery,
  ...ArticleQuery,
};