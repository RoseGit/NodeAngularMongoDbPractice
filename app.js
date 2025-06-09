'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//cargar rutas

app.use(bodyParser.urlencoded({encoded:false}));
app.use(bodyParser.json());

//configurar cabeceras http

//Configurar rutas base 
app.get('/pruebas', function(req, res){
res.status(200).send({message:'bienvenido al curso de rose'});
});

module.exports = app;