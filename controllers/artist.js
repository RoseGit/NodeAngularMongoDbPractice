'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePaginate = require('mongoose-pagination');

function getArtist(req, res) {
    var artistId = req.params.id;
    Artist.findById(artistId)
        .then((artistStored) => {
            // Si se guarda correctamente
            if (!artistStored) {
                return res.status(404).send({ message: 'El artista no existe' });
            } else {
                return res.status(200).send({ artist: artistStored });
            }
        })
        .catch((err) => {
            // Si hay un error al guardar
            console.log(err); // Log the error for debugging
            return res.status(500).send({ message: 'Error en la peticion' });
        });

}


function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
    artist.save()
        .then((artistStored) => {
            // Si se guarda correctamente
            if (!artistStored) {
                return res.status(404).send({ message: 'No se ha registrado el artista' });
            } else {
                return res.status(200).send({ artist: artistStored });
            }
        })
        .catch((err) => {
            // Si hay un error al guardar
            console.log(err); // Log the error for debugging
            return res.status(500).send({ message: 'Error al guardar el artista' });
        });
}

function getArtists(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }

    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage)
        .then((artists) => {
            if (!artists) {
                return res.status(404).send({ message: 'No hay artistas' });
            } else {
                return res.status(200).send({
                    total_items: artists.totalDocs,//FIXME: Actualizar la version de moongose -pagination porque "mongoose": "^8.15.1", no lo soporta y totalDocs es undefined 
                    artists: artists
                });
            }
        })
        .catch((err) => {
            console.log(err); // Log the error for debugging
            return res.status(500).send({ message: 'Error al guardar el artista' });
        });
}


function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;
    Artist.findByIdAndUpdate(artistId, update)
        .then((artistStored) => {
            if (!artistStored) {
                return res.status(404).send({ message: 'no se actualizo el artista porque no existe' });
            } else {
                return res.status(200).send({ artist: artistStored });
            }
        })
        .catch((err) => {
            console.log(err); // Log the error for debugging
            return res.status(500).send({ message: 'Error en la peticion de update' });
        });;
}

function deleteArtist(req, res) {
    var artistId = req.params.id;
    Artist.findByIdAndDelete(artistId)
        .then(artistRemoved => {
            if (!artistRemoved) {
                return res.status(404).send({ message: 'El artista no ha podido ser eliminado' });
            }

            // PASO 1: Eliminar todos los álbumes asociados a este artista
            return Album.deleteMany({ artist: artistRemoved._id })
                .then(() => {

                    // Para mayor claridad y robustez, hagamos la eliminación en cadena más explícita:
                    return Album.find({ artist: artistRemoved._id }) // Primero, encuentra los álbumes
                        .then(albums => {
                            const albumIds = albums.map(album => album._id);

                            // Ahora elimina los álbumes
                            return Album.deleteMany({ artist: artistRemoved._id })
                                .then(() => {
                                    // Finalmente, elimina las canciones cuyos álbumes fueron eliminados
                                    return Song.deleteMany({ album: { $in: albumIds } }); // <-- USAR deleteMany() aquí
                                });
                        });
                });
        })
        .then(() => { // Este .then() se encadena después de que todas las eliminaciones anteriores hayan terminado
            return res.status(200).send({ message: 'Artista y sus álbumes/canciones relacionados eliminados correctamente.' });
        })
        .catch(err => {
            console.error('Error al borrar el artista o sus datos relacionados:', err);
            return res.status(500).send({ message: 'Error al borrar el artista o sus datos relacionados.' });
        });
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        console.log(file_ext);
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'JPG') {
            Artist.findByIdAndUpdate(artistId, { image: file_name })
                .then((artistStored) => {
                    if (!artistStored) {
                        return res.status(404).send({ message: 'no se actualizo el artista porque no existe' });
                    } else {
                        return res.status(200).send({ image: file_name, artist: artistStored });
                    }
                })
                .catch((err) => {
                    console.log(err); // Log the error for debugging
                    return res.status(500).send({ message: 'Error en la peticion de update' });
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
    var path_file = './uploads/artists/'+image_file;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            return res.status(200).send({message: 'No existe la imagen'});
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImagefile
}