const timestamps = require('mongoose-timestamp');
const timestamps = require('mongoose-timestamp');
const paginate = require('mongoose-paginate');
const Schema = require('mongoose').Schema;
const articleJson = require('./json/article.json');
const articleSchema = Schema(
  articleJson,
  {
    toObject: { virtuals: true }
  });
const util = require('../util');

articleSchema.plugin(timestamps);
articleSchema.plugin(paginate);

// virtuals
articleSchema.virtual("createdDate")
  .get(() => {
    return util.getDate(this.createdAt);
  })

articleSchema.virtual("createdTime")
  .get(() => {
    return util.getTime(this.createdAt);
  })

articleSchema.virtual("updateDate")
  .get(() => {
    return util.getDate(this.updateAt);
  })

articleSchema.virtual("updateTime")
  .get(() => {
    return util.getDate(this.updateAt);
  })

module.exports = db.model('Article', articleSchema);