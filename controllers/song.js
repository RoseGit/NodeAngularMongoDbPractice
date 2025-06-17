'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    return res.status(200).send({ message: 'Controlador cancion funcionando' });
}

function saveSong(req, res) {
    var song = new Song();
    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save()
        .then((songStored)=>{
            if(!songStored){
                return res.status(404).send({ message: 'No se ha guardado la cancion ' });    
            }
            return res.status(200).send({song:songStored});
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: 'Error en save song' });
        });
}
module.exports = {
    getSong,
    saveSong
}