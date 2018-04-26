require('dotenv').config();

const express = require('express');
const query = require('../Query');
const ms = require('../message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

exports.singUp = async (req, res) => {
  // 1. 입력한 이메일, 비밀번호, 이름, 유저이름, 확인비밀번호가 정확한지 체크
  if(!req.body.email) {
    return res.status(400).json("이메일을 입력해주세요");
  } else if(!req.body.password) {
    return res.status(400).json("비밀번호를 입력해주세요");
  } else if(!req.body.password2) {
    return res.status(400).json("확인 비밀번호를 입력해주세요");    
  } else if(!req.body.name) {
    return res.status(400).json("이름을 입력해주세요");
  } else if(!req.body.nickname) {
    return res.status(400).json("유저를 입력해주세요");    
  } else if( req.body.password !== req.body.password2) {
    return res.status(400).json("비밀번호와 확인 비밀번호를 똑같이 입력해주세요");
  }

  // 2. 이메일, 유저이름이 하나만 있는지 확인
  const checkEmail = await query.checkIdExist(req.body.email);
  const checkNickname = await query.checkNicknameExist(req.body.nickname);
  if(checkEmail || checkNickname) {
    return res.status(400).json("이메일 또는 닉네임이 이미 존재합니다.");
  }

  // 3. 위의 확인들이 통과하면 그 정보들을 userInfo에 저장
  const userInfo = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    name: req.body.name,
    nickname: req.body.nickname,
  }
  // 4. userInfo에 저장한 값을 데이터베이스에 저장
  const createUser = await query.createUser(userInfo);
  if(createUser) {
    console.log('success')
    return res.status(200).redirect('/user/login');
  }
}

exports.edit = (req, res) => {
  
}