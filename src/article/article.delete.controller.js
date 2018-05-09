const query = require('../Query');
const ms = require('../message');

exports.delete = async (req, res) => {
  const article = await query.removeArticle({ _id: req.params._id });
  if (!article) {
    return res.status(500).json({ error: "데이터베이스 연결상에 문제가 있습니다." });
  }
  res.status(204).redirect('/article/lists');
};