const express = require('express');

const cookie = require('./user.cookie.controller');
const register = require('./user.register.controller');

const app = express();

const router = express.Router();

// 회원가입부분
router.get('/register', (req, res) => {
  res.render('login/register');
});

// 회원가입
router.post('/register', register.singUp);

// 로그인
router.post('/cookie', cookie.cookie);

// login 창
router.get('/login', (req, res) => {
  res.render('login/login');
})

// 로그아웃
router.get('/logout', cookie.cookieRemove);

// user 수정하는 페이지
router.get('/edit', (req, res) => {
  res.render('login/edit');
})

// 수정하는 부분(ejs에서)
router.post('/edit', register.edit);
// 수정하는 부분(back)
router.put('/edit', register.edit);

// 로그인 되었을 때 오는 부분
router.get('/success', (req, res) => {
  res.send(req.user);
})

module.exports = router;