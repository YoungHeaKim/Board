require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');

const PORT = process.env.PORT || 3000;
const app = express();

// passport 관련
const passport = require('passport');
const session = require('express-session');

// mongodb 접속
const mongoose = require('mongoose');
global.db = mongoose.createConnection(process.env.MONGO_URI);
const jwt = require('jsonwebtoken');
const server = http.Server(app);
const query = require('./Query');
// user 부분
const User = require('./user/user');
// 게시판 부분
const Article = require('./article/article');

// ejs 템플릿
// 확장자가 ejs 로 끈나는 뷰 엔진을 추가한다.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 미들웨어 셋팅
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// upload path
app.use('/uploads', express.static('uploads'));

// session 관련 셋팅
var connectMongo = require('connect-mongo');
var MongoStore = connectMongo(session);

var sessionMiddleWare = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 2000 * 60 * 60 //지속시간 2시간
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60
  })
});
app.use(sessionMiddleWare);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// 로그인정보를 뷰에서만 변수로 셋팅
app.use( (req, res, next) => {
  app.locals.isLogin = req.isAuthenticated();
  app.locals.userData = req.user;
  console.log(app.locals.isLogin)
  console.log(req.user)
  next()
})

app.use('/user', User);
app.use('/article', Article);
// 기본페이지를 리스트페이지로 변환
app.use('/', (req, res) => {
  return res.redirect('/article/lists');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

server.listen(PORT, () => {
  console.log(`Able to connect to ${PORT}`);
});

module.exports = server;