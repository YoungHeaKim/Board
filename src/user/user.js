const express = require('express');
const path = require('path');
const passport = require('passport');

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
  res.render(path.join(__dirname, '../../views/LogIn/register.ejs'));
});

// 로그인
router.post('/cookie', cookie.cookie);

// 로그아웃
router.get('/logout', cookie.cookieRemove);

// 회원가입
router.post('/register', register.singUp);

module.exports = router;