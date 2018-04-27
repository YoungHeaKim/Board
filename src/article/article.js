const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

// csurf 셋팅
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

//이미지 저장되는 위치 설정
const uploadDir = path.join(__dirname, '../src/uploads');
const fs = require('fs');

// multer 셋팅
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    callback(null, 'article-' + Date.now() + '.' + file.mimetype.split('/')[1]);
  }
});
const upload = multer({ storage: storage });

const getting = require('./article.get.controller');
const posting = require('./article.post.controller');
const putting = require('./article.put.controller');
const deleting = require('./article.delete.controller');
const loginRequired = require('../libs/loginRequired');

const app = express();

const router = express.Router();

// 메인페이지
router.get('/lists', getting.mainPage);

// 게시글 보여주는 페이지
router.get('/lists/:_id', loginRequired, getting.articlePage);

// 게시글 등록하는 페이지
router.get('/new', loginRequired, (req, res) => {
  res.render('admin/form', { article : "", csrfToken: req.csrfToken() });
})

// 게시글 수정하는 페이지
router.get('/edit/:_id', loginRequired, csrfProtection, getting.editPage);

// 게시글 삭제하는 부분
router.delete('/lists/:_id', loginRequired, deleting.delete);

// 게시글 등록하는 부분
router.post('/new', loginRequired, upload.single('thumbnail'), csrfProtection, posting.createArticle);

// 게시글 수정하는 부분
router.put('/edit/:_id', loginRequired, upload.single('thumbnail'), csrfProtection, putting.edit);

// summernote 부분
router.post('/ajax_summernote', loginRequired, upload.single('thumbnail'), posting.summernote);

module.exports = router;