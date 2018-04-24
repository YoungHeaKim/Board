require('dotenv').config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const server = http.Server(app);
global.db = mongoose.createConnection(process.env.MONGO_URI);

// user 부분
const User = require('./user/user');
// 게시판 부분
const Article = require('./article/article');

// ejs 템플릿
app.set('view engine', 'ejs');

// express application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/user', User);
app.use('/article', Article);

// Passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

server.listen(PORT, () => {
  console.log(`Able to connect to ${PORT}`);
});

module.exports = server;