const timestamps = require('mongoose-timestamp');
const paginate = require('mongoose-paginate');
const Schema = require('mongoose').Schema;
const articleJson = require('./json/article.json');
const articleSchema = Schema(
  articleJson,
  {
    toObject: { virtuals: true }
  });

articleSchema.plugin(timestamps);
articleSchema.plugin(paginate);

articleSchema.virtual('getDate').get(function () {
  const date = new Date(this.createdAt);  
  return {
    year : date.getFullYear(),
    month: date.getMonth()+1,
    day : date.getDate()
  }
})

articleSchema.virtual('updatedDate').get(function () {
  const date = new Date(this.updatedAt);
  return {
    year: date.getFullYear(),
    month: date.getMonth()+1,
    day: date.getDate()
  }
})

module.exports = db.model('Article', articleSchema);