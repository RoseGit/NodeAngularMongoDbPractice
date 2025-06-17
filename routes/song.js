'use strict'

var express = require('express');
var SongController = require('../controllers/song');
//para methods get, post, put, delete, etc
var api = express.Router();

var md_auth = require('../middlewares/authenticated');

//subir archivos 
var multipart = require('connect-multiparty');

//subior archivos y que esten disponibles en req.files
var md_upload = multipart({uploadDir: './uploads/songs'});

api.get('/song', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
module.exports = api;