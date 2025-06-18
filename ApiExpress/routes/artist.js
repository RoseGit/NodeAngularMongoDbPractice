'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
//para methods get, post, put, delete, etc
var api = express.Router();

var md_auth = require('../middlewares/authenticated');

//subir archivos 
var multipart = require('connect-multiparty');

//subior archivos y que esten disponibles en req.files
var md_upload = multipart({uploadDir: './uploads/artists'});

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);//page optional
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImagefile);
module.exports = api;