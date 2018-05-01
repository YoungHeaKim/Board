const query = require('../Query');
const ms = require('../message');
const jwt = require('jsonwebtoken');

exports.createArticle = async (req, res) => {
  // 1. 로그인되어 있는 유저의 정보를 가져옴
  const token = req.cookies.auth;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await query.checkUserBy_id(decoded.id);
  // 2. 생성될 데이터를 ArticleInfo에 담음
  const ArticleInfo = {
    title: req.body.title,
    writer: user._id,
    thumnail: (req.file) ? req.file.filename : "",
    content: req.body.content
  }
  const articleCreate = await query.createArticle(ArticleInfo);
  if(articleCreate) {
    return res.status(200).json('글 등록 성공')
    // return res.status(200).redirect('/article/lists');
  }
};

exports.summernote = (req, res) => {
  res.send('/uploads' + req.file.filename);
}