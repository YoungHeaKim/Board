const query = require('../Query');
const ms = require('../message');

exports.edit = async (req, res) => {
  // 1. 수정을 원하는 게시글을 찾아온다.
  const article = await query.findArticleById(req.params._id);
  if (!article) {
    return res.status(400).json('찾으시는 글이 없습니다.')
  }
  // 2. 요청중에 파일이 존재 할 때 이전이미지를 지운다.
  if (req.file) {
    consol.log('요청파일 존재 시 이전이미지 삭제부분')
    fs.unlinkSync(uploadDir + '/' + article.thumbnail);
  }

  // 3. 찾아온 게시글을 수정하고 그 수정한 데이터를 articleEdit에 저장
  const articleEdit = {
    title: req.body.title,
    thumbnail: (req.file) ? req.file.filename : article.thumbnail,
    content: req.body.content
  }
  console.log(articleEdit);
  // 4. 저장한 articleEdit을 데이터베이스에 저장
  const updateArticle = await query.updateTitleAndDescription(article._id, articleEdit);

  if (updateArticle) {
    return res.status(200).json('성공')
  }
};