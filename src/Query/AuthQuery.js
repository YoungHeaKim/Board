const User = require('../models/user');

module.exports = {
  checkIdExist(email) {
    return User.findOne({
      email: email
    });
  },
  checkNicknameExist(nickname) {
    return User.findOne({
      nickname: nickname
    });
  },
  createUser(data) {
    return User.create({
      email: data.email,
      password: data.password,
      name: data.name,
      nickname: data.nickname
    })
  },
}