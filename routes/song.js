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

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
module.exports = api;