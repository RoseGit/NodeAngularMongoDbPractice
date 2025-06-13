'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
    res.status(200).send({message:'Method get artist'});
}


function saveArtist(req, res){
    var artist = new Artist();
    var params = req.body;
    artist.description = params.description;
    artist.image = 'null';
    artist.save()
    .then((artistStored)=>{
        // Si se guarda correctamente
        if(!artistStored){
            return res.status(404).send({message: 'No se ha registrado el artista'});
        } else {
            return res.status(200).send({artist: artistStored});
        }
    })
    .catch((err)=> {
        // Si hay un error al guardar
        console.log(err); // Log the error for debugging
        return res.status(500).send({message: 'Error al guardar el artista'});
    });
}

module.exports = {
    getArtist,
    saveArtist
}