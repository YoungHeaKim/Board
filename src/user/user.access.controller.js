require('dotenv').config();

const express = require('express');
const query = require('../Query');
const jwt = require('jsonwebtoken');

const router = express.Router();

exports.accessChecker = (req, res, next) => {
  
}