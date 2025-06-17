'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
    return res.status(200).send({message:'Controlador cancion funcionando'});
}

module.exports = {
    getSong
}