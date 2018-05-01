require('dotenv').config();

const express = require('express');
const query = require('../Query');
const jwt = require('jsonwebtoken');

const router = express.Router();

exports.accessChecker = (req, res, next) => {
  if (req.cookies === undefined) {
    return res.redirect('/user/login');
  }
  const token = req.cookies.auth;
  // token이 빈 문자열일 때 로그인창으로 보내는 부분
  if (token === "") {
    return res.redirect('/user/login');
  }
  // token의 타입이 undefined일 때 확인하는 부분
  if (typeof token !== 'undefined') {
    // decoded에 암호화된 jwt를 저장하는 부분
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      res.redirect('/user/login');
    } else {
      return next();
    }
  } else {
    return res.redirect('/user/login');
  }
}