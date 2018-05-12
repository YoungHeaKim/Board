require('dotenv').config();

const query = require('../Query');
const ms = require('../message');
const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.delete = async (req, res) => {
  const articleRemove = await query.findArticleById(req.params._id);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: articleRemove.thumbnail
  }
  s3.deleteObject(params, (err, data, next) => {
    if(err) {
      console.log(err)
    } else {
      console.log(data)
    }
  })
  
  const article = await query.removeArticle({ _id: req.params._id });
  if (!article) {
    return res.status(500).json({ error: "데이터베이스 연결상에 문제가 있습니다." });
  }
  res.status(204).redirect('/article/lists');
};