'use strict'
//Para guardar el password encriptado
var bcrypt = require('bcrypt-nodejs')

//Cargamos el modelo de usuario
var User = require('../models/user');

var jwt = require('../services/jwt');
function pruebas(req, res){
    res.status(200).send({
        message:'Probando una accion del controlador de usuarios del aPI rest con node y mongo'
    });
}

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    console.log(params);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        //encriptar contraseña y guardar datos
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email!= null){
                user.save() // No more callback here
                .then((userStored) => {
                    // Si se guarda correctamente
                    if(!userStored){
                        return res.status(404).send({message: 'No se ha registrado el usuario'});
                    } else {
                        return res.status(200).send({user: userStored});
                    }
                })
                .catch((err) => {
                    // Si hay un error al guardar
                    console.log(err); // Log the error for debugging
                    return res.status(500).send({message: 'Error al guardar el usuario'});
                });
            }else{
                res.status(200).send({message:'Introduce todos los campos'});        
            }
        });
    }else{
        res.status(200).send({message:'Introduce la contraseña'});
    }
}

function loginUser(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({email: email.toLowerCase()})
    .then((userStored)=>{
        // Si se guarda correctamente
        if(!userStored){
            return res.status(404).send({message: 'No se ha registraEl usuario no existe'});
        } else {
            bcrypt.compare(password, userStored.password, function(err, check){
                if(check){
                    //devolver los datos del usuario logeado
                    if(params.getHash){
                        //generar bearer token
                        res.status(200).send({
                            token: jwt.createToken(userStored)
                        });
                    }else{
                        res.status(200).send({user: userStored});
                    }
                }else{
                    return res.status(404).send({message: 'No se ha podido logearse'});
                }
            });
        }
    })
    .catch((err)=> {
        console.log(err); // Log the error for debugging
        return res.status(500).send({message: 'Error en la peticion '});
    });
}


module.exports = {
    pruebas,
    saveUser,
    loginUser
};