'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePaginate = require('mongoose-pagination');

function getAlbum(req, res) {
    var albumId = req.params.id;
    Album.findById(albumId).populate({ path: 'artist' }).exec()//con populate obtiene los datos del artista asociado
        .then((albumStore) => {
            if (!albumStore) {
                return res.status(404).send({ message: 'No existe el album' });
            } else {
                return res.status(200).send({ album: albumStore });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: 'Error al obtenr el album' });
        });
}

function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save()
        .then((albumStored) => {
            // Si se guarda correctamente
            if (!albumStored) {
                return res.status(404).send({ message: 'No se ha registrado el album' });
            } else {
                return res.status(200).send({ album: albumStored });
            }
        })
        .catch((err) => {
            // Si hay un error al guardar
            console.log(err); // Log the error for debugging
            return res.status(500).send({ message: 'Error al guardar el album' });
        });
}

function getAlbums(req, res) {
    var artistId = req.params.artist;
    if (!artistId) {
        //sacar todos los albums de la base de datos 
        var find = Album.find({}).sort('title');
    } else {
        //sacar los albums de un artista concreto de la base de datos 
        var find = Album.find({ artist: artistId }).sort('year');
    }

    find.populate({ path: 'artist' }).exec()
        .then((albums) => {
            if (!albums) {
                return res.status(404).send({ message: 'No hay albums ' });
            }
            return res.status(200).send({ albums: albums });
        })
        .catch((err) => {
            console.log(err); // Log the error for debugging
            return res.status(500).send({ message: 'Error en peticion get albums' });
        });
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update)
        .then((albumUpdated) => {
            if (!albumUpdated) {
                res.status(404).send({ message: 'No se ha actualizado album' });
            } else {
                res.status(200).send({ album: albumUpdated });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ message: 'Error en peticion update album' });
        });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;
    var albumId = req.params.id; // This is the ID of the single album to be deleted

    // PASO 1: Eliminar el álbum específico por su ID
    Album.findByIdAndDelete(albumId) // Usamos findByIdAndDelete para un solo documento por ID
        .then(albumRemoved => {
            if (!albumRemoved) {
                // Si el álbum no se encontró para eliminar
                return res.status(404).send({ message: 'El álbum no ha podido ser eliminado o no existe.' });
            }

            // PASO 2: Si el álbum se eliminó correctamente, eliminar todas las canciones asociadas a este álbum
            // Ahora, 'albumRemoved._id' es la ID del álbum que acabamos de eliminar.
            // Usamos deleteMany con un objeto de filtro para las canciones.
            return Song.deleteMany({ album: albumRemoved._id }) 
                .then(() => {
                    // Si las canciones se eliminaron (o no había ninguna), el proceso es exitoso
                    return res.status(200).send({
                        album: albumRemoved,
                        message: 'Álbum y sus canciones relacionadas eliminados correctamente.'
                    });
                });
        })
        .catch(err => {
            console.error('Error al borrar el álbum o sus datos relacionados:', err);
            return res.status(500).send({ message: 'Error al borrar el álbum o sus datos relacionados.' });
        });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        console.log(file_ext);
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'JPG') {
            Album.findByIdAndUpdate(albumId, { image: file_name })
                .then((albumStored) => {
                    if (!albumStored) {
                        return res.status(404).send({ message: 'no se actualizo el album porque no existe' });
                    } else {
                        return res.status(200).send({ album: albumStored });
                    }
                })
                .catch((err) => {
                    console.log(err); // Log the error for debugging
                    return res.status(500).send({ message: 'Error en la peticion de image' });
                });
        } else {
            return res.status(200).send({ message: 'extencion del archivo no valida' });
        }
        console.log(file_path);
    } else {
        return res.status(200).send({ message: 'No ha subido ninguna imagen' });
    }
}

function getImagefile(req, res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/albums/'+image_file;
    console.log('Rose the image is '+path_file);
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            return res.status(200).send({message: 'No existe la imagen'});
        }
    })
}
module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    getImagefile,
    uploadImage

}