const express = require('express');
const path = require('path');
const passport = require('passport');

const cookie = require('./user.cookie.controller');
const register = require('./user.register.controller');

const app = express();

const router = express.Router();

module.exports = router;