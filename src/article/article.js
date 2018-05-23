require('dotenv').config();

const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const paginate = require('express-paginate');

// csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

//이미지 저장되는 위치 설정
const uploadDir = path.join(__dirname, '../../uploads');
const fs = require('fs');

// aws s3 부분
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;
const s3 = new aws.S3({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
});

// s3에 사진 업로드
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

// uploads파일에 사진 업로드
const uploadPic = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) { //이미지가 저장되는 도착지 지정
      callback(null, uploadDir);
    },
    filename: function (req, file, callback) { // products-날짜.jpg(png) 저장 
      callback(null, 'products-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
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
router.get('/edit/:_id', csrfProtection, getting.editPage);

// 게시글 등록하는 페이지
router.get('/new', csrfProtection, (req, res) => {
  res.render('admin/form', { article: "", editPage: "", csrfToken: req.csrfToken() });
})

// 게시글 등록하는 부분
router.post('/new', upload.single('thumbnail'), csrfProtection, posting.createArticle);

// 게시글 수정하는 부분
router.post('/edit/:_id', upload.single('thumbnail'), csrfProtection, putting.edit);
router.put('/edit/:_id', upload.single('thumbnail'), csrfProtection, putting.edit);

// 게시글 삭제하는 부분
router.get('/delete/:_id', deleting.delete);
router.delete('/delete/:_id', deleting.delete);

// summernote 부분
router.post('/ajax_summernote', uploadPic.single('thumbnail'), (req, res) => {
  res.send('/uploads/' + req.file.filename);
});

module.exports = router;