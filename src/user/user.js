const express = require('express');
const path = require('path');

const cookie = require('./user.cookie.controller');
const register = require('./user.register.controller');

const app = express();

const router = express.Router();

// login 창
router.get('/login', (req, res) => {
  res.render(path.join(__dirname, '../views/login/login.ejs'));
})

// 회원가입부분
router.get('/register', (req, res) => {
  res.render(path.join(__dirname, '../views/LogIn/register.ejs'));
});

// 로그인
router.post('/cookie', cookie.cookie);

// 로그아웃
router.get('/logout', cookie.cookieRemove);

// 회원가입
router.post('/register', register.singUp);

// user 수정하는 페이지
router.get('/edit', (req, res) => {
  res.render(path.join(__dirname, '../views/login/edit.ejs'));
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