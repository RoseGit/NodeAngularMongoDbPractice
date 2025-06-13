'use stricts'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();


//Cargando middleware de validacion jwt
var md_auth = require('../middlewares/authenticated');

//subir archivos 
var multipart = require('connect-multiparty');

//subior archivos y que esten disponibles en req.files
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/probando-controlador', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/probando-controlador-jwt', md_auth.ensureAuth, UserController.pruebasJwt);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);//id obligatorio
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImagefile);

module.exports = api;