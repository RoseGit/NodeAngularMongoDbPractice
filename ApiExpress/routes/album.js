'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
//para methods get, post, put, delete, etc
var api = express.Router();

var md_auth = require('../middlewares/authenticated');

//subir archivos 
var multipart = require('connect-multiparty');

//subior archivos y que esten disponibles en req.files
var md_upload = multipart({uploadDir: './uploads/albums'});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImagefile);
module.exports = api;