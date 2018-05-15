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
    return res.status(200).send('<script>alert("환영합니다. 회원가입에 성공하였습니다.");location.href="/user/login";</script>')
  }
}

exports.edit = async (req, res) => {
  // 1. 로그인이 되어있는 정보 가져오기
  const token = req.cookies.auth;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await query.checkUserBy_id(decoded.id);
  const Password = user.password;
  const checkPassword = req.body.checkPassword;
  // 2. 로그인이 되어있는 유저의 비밀번호와 입력한 비번이 일치하는지 확인
  const check = (user && bcrypt.compareSync(checkPassword, Password)) ? (null, user) : (null, false);
  // 3. 확인이 되면 유저 정보를 수정
  if (!check) {
    return res.status(400).json('확인 비밀번호가 맞지않습니다.')
  } else {
    // 4. 수정한 정보를 데이터베이스에 저장
    const userInfo = {
      email: user.email,
      password: bcrypt.hashSync(req.body.newPassword, 10),
      name: user.name,
      nickname: req.body.newNickname
    };

    // 이메일이 하나만 있는지 확인하는 부분
    const checkNickname = await query.checkNicknameExist(userInfo.nickname);
    if (checkNickname !== null) {
      return res.status(400).json('닉네임이 이미 존재합니다.')
    }
    const updateUser = await query.updateUser(user._id, userInfo)
    if (updateUser) {
      return res.status(200).redirect('/article/lists')
    }
    return res.status(400).json('수정되지 않았습니다.');
  } 
}