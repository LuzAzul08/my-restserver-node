//IMPORTACIONES
const express = require('express')  //Permite administrar un servidor en un puerto
//const bcrypt = require('bcrypt')    //Permite encriptar la contraseña hash, disponible paara version LTS node
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')    //importa el esquema del modelo Usuario

const {OAuth2Client} = require('google-auth-library');  //Autentificación de google
const client = new OAuth2Client(process.env.CLIENT_ID); //Autentificación



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


//CONFIGURACION de google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

  //verify().catch(console.error);

app.post( '/google', async (req, res) => {

    let token = req.body.idtoken

    let googleUser = await verify(token)
        .catch( e => {
            return res.status(403).json({
                ok:false,
                err: e
            })
        })

    Usuario.findOne( { email: googleUser.email }, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(usuarioDB){
            if( usuarioDB.google === false ){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'Ya cuenta con una cuenta normal'
                    }
                })
            }else {

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED,{ 
                    expiresIn: process.env.CADUCIDAD_TOKEN
                })

                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                })
            }
        }else {

            let usuario = new Usuario()

            usuario.name = googleUser.name
            usuario.email = googleUser.email
            usuario.password = 'nose'
            usuario.img = googleUser.img
            usuario.google = true

            usuario.save( (err, usuarioDB) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
            })

            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED,{ 
                expiresIn: process.env.CADUCIDAD_TOKEN
            })

            return res.json({
                ok:true,
                usuario: usuarioDB,
                token
            })
            
        }

    })

} )



//EXPORTACIONES
module.exports = app