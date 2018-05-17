require('dotenv').config();

const query = require('../Query');
const ms = require('../message');
const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.delete = async (req, res) => {
  const articleRemove = await query.findArticleById(req.params._id);
  // thumbnail이 있을 때 s3에서 사진 삭제
  if(req.thumbnail) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: articleRemove.thumbnail
    }
    s3.deleteObject(params, (err, data) => {
      if(err) {
        console.log(err)
      }
    })
  }
  
  const article = await query.removeArticle({ _id: req.params._id });
  if (!article) {
    return res.status(500).json({ error: "데이터베이스 연결상에 문제가 있습니다." });
  }
  res.status(204).redirect('/article/lists');
};