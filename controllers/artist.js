'use strict'

var path = require('path');
var fs = require('fs');

var Artis = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
    res.status(200).send({message:'Method get artist'});
}

module.exports = {
    getArtist
}