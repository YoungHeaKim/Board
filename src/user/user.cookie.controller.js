require('dotenv').config();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ms = require('../message');
const bcrypt = require('bcrypt');
const query = require('../Query');

// passport serialize
passport.serializeUser((user, done) => {
  console.log('serialize');
  done(null, user);
});

// passport deserialize
passport.deserializeUser((user, done) => {
  console.log('deserialize');
  done(null, user);
});

// local strategy
passport.use('sign-in', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
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
    req.logIn(user, (err) => {
      if(err) {
        return res.send('<script>alert("로그인을 해주세요");location.href="/user/login";</script>');
      }
      console.log('성공')
      return res.cookie('auth', token, { expires: date }).send('<script>alert("로그인에 성공하였습니다.");location.href="/article/lists";</script>');
    })
  })(req, res);
};

// log out 부분
exports.cookieRemove = (req, res) => {
  const date = new Date();
  // token에 빈 문자열을 넣어주면서 원래있던 토큰 삭제
  const token = "";
  req.logout();
  req.session.destroy();
  return res.cookie('auth', token, { expires: date }).redirect('/user/login');
};