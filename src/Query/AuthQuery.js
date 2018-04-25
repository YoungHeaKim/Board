const User = require('../models/user');

module.exports = {
  checkIdExist(email) {
    return User.findOne({
      email: email
    });
  },
  checkUsernameExist(username) {
    return User.findOne({
      username: username
    });
  },
  createUser(data) {
    return User.create({
      email: data.email,
      password: data.password,
      name: data.name,
      username: data.username
    })
  },
}