const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const paginate = require('mongoose-paginate');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userJson = require('./json/user.json');
const userSchema = Schema(userJson);

userSchema.plugin(timestamps);
userSchema.plugin(paginate);

module.exports = mongoose.model('User', userSchema);