const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const getting = require('./article.get.controller');
const posting = require('./article.post.controller');
const putting = require('./article.put.controller');
const deleting = require('./article.delete.controller');

const app = express();

const router = express.Router();

module.exports = router;