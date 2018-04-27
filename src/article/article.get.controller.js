const query = require('../Query');
const ms = require('../message');
const path = require('path');

exports.mainPage = async (req, res) => {
  // 1.모든 게시글을 가져온다.
  const articleList = await query.findAllArticle()
  // 2. articleList에서 writer의 아이디 값만 가져와야한다. 
  // const nickname = articleList.forEach((article) => {
  //   const wirterId = article.writer;
  //   // 3. 해당 게시글의 유저이름을 가져와야한다. 
  //   const user = await query.checkUserBy_Id(writerId);
  //   return user.nickname;
  // });
  res.status(200).render((path.join(__dirname, '../views/article/main.ejs')), { articleList: articleList });

};

exports.articlePage = async (req, res) => {
  // 1. 현재 로그인이 되어있는 token을 가져온다.(게시글을 쓴사람을 체크하기 위해)
  const token = req.cookies.auth;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const CurrentUser = await query.checkUserBy_id(decoded.id);

  // 2. 원하는 글의 정보를 불러오는 부분
  const article = await query.findArticleById(req.params._id);

  // 3. 해당게시글에 username을 가져오는 부분
  const writerId = articleList.writer;
  const userId = await query.checkUserBy_id(writerId);
  const nickname = userId.nickname;
  if (!article) {
    console.log('게시글부분 오류')
    res.status(400).json('게시글이 없습니다.')
  }
  res.status(200).render((path.join(__dirname, '../views/article/show.ejs')), { article: article, CurrentUser: CurrentUser, nickname: nickname });
};

exports.editPage = async (req, res) => {
  const article = await query.findArticleById(req.params._id);
  if (!article) {
    res.status(400).json('해당 게시글을 불러 올 수 없습니다.')
  }
  res.status(200).render( 'admin/form', { article: article, csrfToken: req.csrfToken() });
};