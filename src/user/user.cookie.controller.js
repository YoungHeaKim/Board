require('dotenv').config();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ms = require('../message');
const bcrypt = require('bcrypt');
const query = require('../Query');

// passport serialize
passport.serializeUser(function (user, done) {
  console.log('serialize');
  done(null, user);
})

// passport deserialize
passport.deserializeUser( function (user, done) {
  const result = user;
  result.password = "";
  console.log('deserializeUser');
  done(null, result);
})

// local strategy
passport.use('sign-in', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (req, email, password, done) => {
  console.log('LocalStrategy');
  const checkUser = await query.checkIdExist(email);
  (checkUser && bcrypt.compareSync(password, checkUser.password)) ? done(null, checkUser) : done(null, false);
}));

// 로그인시 쿠키 생성하는 부분
exports.cookie = (req, res) => {
  passport.authenticate('sign-in', (err, user, info) => {
    const token = jwt.sign({
      id: user._id,
      expiresIn: '10h'
    }, process.env.JWT_SECRET);
    let date = new Date();
    // 토큰 10시간 유지
    date.setTime(date.getTime() + (1000 * 60 * 60 * 10));
    if (!token) {
      return res.redirect('/user/login');
    }
    return res.cookie('auth', token, { expires: date }).send('<script>alert("로그인 성공");location.href="/";</script>');
  })(req, res);
};

// 로그아웃 시 쿠키 삭제하는 부분
exports.cookieRemove = (req, res) => {
  const date = new Date();
  const token = "";
  return res.cookie('auth', token, { expires: date }).redirect('/user/login');
};