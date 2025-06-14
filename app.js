'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');

app.use(bodyParser.urlencoded({encoded:false}));
app.use(bodyParser.json());

//configurar cabeceras http

//configurar ruta base 
app.use('/api', user_routes);
app.use('/api', artist_routes);

module.exports = app;