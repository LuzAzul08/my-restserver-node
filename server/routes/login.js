//IMPORTACIONES
const express = require('express')  //Permite administrar un servidor en un puerto
//const bcrypt = require('bcrypt')    //Permite encriptar la contraseña hash, disponible paara version LTS node
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')    //importa el esquema del modelo Usuario

//iniciando el express 
const app = express()

app.post( '/login', async (req, res) => {

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

        //if(bcrypt.compareSync( body.password, usuarioDB.password )){
        let est = usuarioDB.matchPassword(body.password)
        if(!est){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario o contraseña* incorrecta'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED,{ 
            expiresIn: process.env.CADUCIDAD_TOKEN
        })

        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        })

    })


})

module.exports = app