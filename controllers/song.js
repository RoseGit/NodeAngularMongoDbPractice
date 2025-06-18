'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    var songId = req.params.id;
    Song.findById(songId)
        .populate({ path: 'album' }).exec()
        .then((songStore) => {
            if (!songStore) {
                return res.status(404).send({ message: 'No existe el song' });
            } else {
                return res.status(200).send({ song: songStore });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: 'Error al obtenr el song' });
        });
}

function getSongs(req, res) {
    var albumId = req.params.album;
    if (!albumId) {
        var find = Song.find({}).sort('number');
    } else {
        var find = Song.find({ album: albumId }).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec()
        .then((songsStore) => {
            if (!songsStore) {
                return res.status(404).send({ message: 'No existe el songs' });
            } else {
                return res.status(200).send({ songs: songsStore });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: 'Error al obtenr el songs' });
        });
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
        .then((songStored) => {
            if (!songStored) {
                return res.status(404).send({ message: 'No se ha guardado la cancion ' });
            }
            return res.status(200).send({ song: songStored });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: 'Error en save song' });
        });
}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update)
        .then((songUpdated) => {
            if (!songUpdated) {
                res.status(404).send({ message: 'No se ha actualizado song' });
            } else {
                res.status(200).send({ song: songUpdated });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: 'Error en peticion update song' });
        });
}

function deleteSong(req, res) {
    var songId = req.params.id;
    Song.findByIdAndDelete(songId)
        .then(songRemoved => {
            if (!songRemoved) {
                return res.status(404).send({ message: 'El song no ha podido ser eliminado o no existe.' });
            }

            return res.status(200).send({
                song: songRemoved,
                message: 'song eliminados correctamente.'
            })
            .catch(err => {
                console.error('Error al borrar el song ', err);
                return res.status(500).send({ message: 'Error al borrar el song' });
            });
        });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong
}