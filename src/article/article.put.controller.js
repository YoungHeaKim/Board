require('dotenv').config();

const query = require('../Query');
const ms = require('../message');
const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.edit = async (req, res) => {
  // 1. 수정을 원하는 게시글을 찾아온다.
  const article = await query.findArticleById(req.params._id);
  if (!article) {
    return res.status(400).json('찾으시는 글이 없습니다.')
  }
  // 2. 만약 기존파일과 새로운 파일이 다르면 기존파일은 삭제 해준다.
  if(req.thumbnail !== req.file.key) {
    console.log('요청파일 존재 시 이전이미지 삭제부분')
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: article.thumbnail
    }
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err)
      }
    })
  }
  // 3. 파일 수정
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: article.thumbnail
  }
  s3.putObject(params, (err, data) => {
    if (err) {
      console.log(err)
    }
  })

  // 3. 찾아온 게시글을 수정하고 그 수정한 데이터를 articleEdit에 저장
  const articleEdit = {
    title: req.body.title,
    thumbnail: (req.file) ? req.file.key : article.thumbnail,
    content: req.body.content
  }
  // 4. 저장한 articleEdit을 데이터베이스에 저장
  const updateArticle = await query.updateTitleAndDescription(article._id, articleEdit);
  if (updateArticle) {
    // return res.status(200).json('성공')
    return res.status(200).redirect('/article/lists');
  }
};