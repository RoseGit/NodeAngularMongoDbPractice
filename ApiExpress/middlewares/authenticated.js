'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

//se ejecuta antes del controlador 
exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message:'La peticion no tiene la cabecera de authentication'});
    }

    //quitar comillas a token
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try{
        var payload = jwt.decode(token, secret);
        //valida la fecha de expiracion 
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:'El token ha expirado'});    
        }
    }catch(err){
        console.log(err);
        return res.status(403).send({message:'El token no es valido'});
    }

    //ponemos los datos del usuario en req
    req.user = payload;
    next();
};