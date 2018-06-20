const query = require('../Query');
const ms = require('../message');
const jwt = require('jsonwebtoken');
const paginate = require('express-paginate');

exports.mainPage = async (req, res) => {
  // paginate부분
  const [ results, itemCount ] = await Promise.all([
    query.findAllArticle().sort('-createdAt').limit(req.query.limit).skip(req.skip).exec(),
    query.ArticleCount()
  ]);
  // article writer와 user db에 있는 user의 이름을 articleList라는 배열에 저장하는 부분
  const articleList = [];
  for (let idx = 0; idx < results.length; idx++) {
    const articleObj = {};
    const user = await query.checkUserBy_id(results[idx].writer);
    articleObj._id = results[idx]._id;
    articleObj.title = results[idx].title;
    articleObj.writer = user.nickname;
    articleObj.getDate = results[idx].getDate;
    articleObj.updatedDate = results[idx].updatedDate;
    articleObj.createdAt = results[idx].createdAt;
    articleList.push(articleObj);
  }
  
  const pageCount = Math.ceil(itemCount / req.query.limit);

  const pages = paginate.getArrayPages(req)( 5, pageCount, req.query.page);

  res.status(200).render('article/main', {
    articleList: articleList,
    pages: pages,
    pageCount: pageCount,
  });
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
  res.status(200).render('article/show.ejs', { article: article, nickname: nickname });
};