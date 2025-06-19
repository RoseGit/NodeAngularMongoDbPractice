'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

//mongoose.connect('mongodb://localhost:27017/curso_node_angular')
mongoose.connect('mongodb://host.docker.internal:27017/curso_node_angular')
    .then(() => {
        // Si la conexión es exitosa, se ejecuta este bloque
        console.log('La conexión a la base de datos está funcionando correctamente...');

        // Inicia tu servidor Express solo DESPUÉS de una conexión exitosa a la DB
        app.listen(port, function() {
            console.log("Servidor del api rest de musica escuchando en http://localhost:" + port);
        });
    })
    .catch(err => {
        // Si hay un error en la conexión, se ejecuta este bloque
        console.error('Error al conectar a la base de datos:', err);
        // Opcional: podrías querer lanzar el error para que el proceso falle
        // throw err;
    });
