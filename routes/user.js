'use stricts'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();


//Cargando middleware de validacion jwt
var md_auth = require('../middlewares/authenticated');

api.get('/probando-controlador', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/probando-controlador-jwt', md_auth.ensureAuth, UserController.pruebasJwt);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);//id obligatorio

module.exports = api;