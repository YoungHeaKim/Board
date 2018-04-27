module.exports = function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/user/login');
  } else {
    return next();
  }
};