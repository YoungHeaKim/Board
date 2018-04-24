require('dotenv').config();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ms = require('../message');
const bcrypt = require('bcrypt');
const query = require('../Query');

exports.cookie = (req, res) => {

};

exports.cookieRemove = (req, res) => {

};