require('dotenv').config();

const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const paginate = require('express-paginate');

//이미지 저장되는 위치 설정
const uploadDir = path.join(__dirname, '../uploads');
const fs = require('fs');

// aws s3 부분
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;
const s3 = new aws.S3({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
});

// 사진 업로드
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: (req, file, cb) => {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension)
    },
    acl: 'public-read-write',
  })
});

const getting = require('./article.get.controller');
const posting = require('./article.post.controller');
const putting = require('./article.put.controller');
const deleting = require('./article.delete.controller');

const app = express();

const router = express.Router();

// 게시글 보여주는 페이지
router.get('/lists/:_id', getting.articlePage);

// 메인페이지
router.get('/lists', paginate.middleware(5,50), getting.mainPage);

// 게시글 수정하는 페이지
router.get('/edit/:_id', getting.editPage);

// 게시글 등록하는 페이지
router.get('/new', (req, res) => {
  res.render('admin/form', { article : "" });
})

// 게시글 등록하는 부분
router.post('/new', upload.single('thumbnail'), posting.createArticle);

// 게시글 수정하는 부분
router.post('/edit/:_id', upload.single('thumbnail'), putting.edit);
router.put('/edit/:_id', upload.single('thumbnail'), putting.edit);

// 게시글 삭제하는 부분
router.get('/delete/:_id', deleting.delete);
router.delete('/delete/:_id', deleting.delete);

// summernote 부분
router.post('/ajax_summernote', upload.single('thumbnail'), posting.summernote);

module.exports = router;