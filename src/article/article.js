const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

//이미지 저장되는 위치 설정
const uploadDir = path.join(__dirname, '../uploads');
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

const app = express();

const router = express.Router();

// 게시글 보여주는 페이지
router.get('/lists/:_id', getting.articlePage);

// 메인페이지
router.get('/lists', getting.mainPage);

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