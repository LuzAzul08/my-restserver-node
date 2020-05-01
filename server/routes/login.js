//IMPORTACIONES
const express = require('express')  //Permite administrar un servidor en un puerto
//const bcrypt = require('bcrypt')    //Permite encriptar la contraseña hash, disponible paara version LTS node
const Usuario = require('../models/usuario')    //importa el esquema del modelo Usuario

//iniciando el express 
const app = express()

app.post( '/login', (req, res) => {

    const body = req.body

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario* o contraseña incorrecta'
                }
            })
        }

        // if(bcrypt.compareSync( body.password, usuarioDB.password )){
        //     return res.status(400).json({
        //         ok:false,
        //         err: {
        //             message: 'Usuario o contraseña* incorrecta'
        //         }
        //     })
        // }

        res.json({
            ok:true,
            usuario: usuarioDB,
            token: 123
        })

    })


})

module.exports = app