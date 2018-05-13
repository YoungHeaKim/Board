const query = require('../Query');
const ms = require('../message');
const path = require('path');
const jwt = require('jsonwebtoken');

exports.mainPage = async (req, res) => {
  const articles = await query.findAllArticle()
  const articleList = [];
  for(let idx = 0; idx < articles.length; idx++) {
    const articleObj = {};
    const user = await query.checkUserBy_id(articles[idx].writer);
    articleObj._id = articles[idx]._id;    
    articleObj.title = articles[idx].title;
    articleObj.writer = user.nickname;
    articleObj.getDate = articles[idx].getDate;
    articleObj.updatedDate = articles[idx].updatedDate;    
    articleList.push(articleObj);
  }
  res.status(200).render((path.join(__dirname, '../views/article/main.ejs')), { articleList: articleList });
};

exports.articlePage = async (req, res) => {
  // 1. 원하는 글의 정보를 불러오는 부분
  const article = await query.findArticleById(req.params._id);
  // 2. 해당게시글에 username을 가져오는 부분
  const writerId = article.writer;
  const userId = await query.checkUserBy_id(writerId);
  const nickname = userId.nickname;
  if (!article) {
    console.log('게시글부분 오류')
    res.status(400).json('게시글이 없습니다.')
  }
  res.status(200).render((path.join(__dirname, '../views/article/show.ejs')), { article: article, nickname: nickname });
};

exports.editPage = async (req, res) => {
  const article = await query.findArticleById(req.params._id);
  if (!article) {
    res.status(400).json('해당 게시글을 불러 올 수 없습니다.')
  }
  res.status(200).render( 'admin/form', { article: article });
};