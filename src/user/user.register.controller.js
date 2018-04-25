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
    return res.status(ms.code[1]).json(ms.json[0]);
  } else if(!req.body.password) {
    return res.status(ms.code[1]).json(ms.json[1]);    
  } else if(!req.body.password2) {
    return res.status(ms.code[1]).json(ms.json[2]);    
  } else if(!req.body.name) {
    return res.status(ms.code[1]).json(ms.json[3]);
  } else if(!req.body.username) {
    return res.status(ms.code[1]).json(ms.json[4]);    
  } else if( req.body.password !== req.body.password2) {
    return res.status(ms.code[1]).json(ms.json[5]);
  }

  // 2. 이메일, 유저이름이 하나만 있는지 확인
  const checkEmail = await query.checkIdExist(req.body.email);
  const checkUsername = await query.checkUsernameExist(req.body.username);
  if(checkEmail || checkUsername) {
    return res.status(ms.code[2]).json(ms.json[6]);
  }

  // 3. 위의 확인들이 통과하면 그 정보들을 userInfo에 저장
  const userInfo = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    name: req.body.name,
    username: req.body.username,
  }
  // 4. userInfo에 저장한 값을 데이터베이스에 저장
  const createUser = await query.createUser(userInfo);
  if(createUser) {
    console.log('success')
    return res.status(ms.code[0]).redirect('/user/login');
  }
}

exports.edit = (req, res) => {
  
}