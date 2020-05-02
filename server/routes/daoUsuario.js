
//Importaciones
const express = require('express')  //Permite administrar un servidor en un puerto
const bodyParser = require('body-parser')   // permite obtener datos a partir del url
const Usuario = require('../models/usuario')    //importa el esquema del modelo Usuario
//const bcrypt = require('bcrypt')    //Permite encriptar la contraseña hash, disponible paara version LTS node
const _ = require('underscore') //Permite fultar las columnas a mostrar
const { vToken, verificaAdmRol } = require('../middlewares/autentificacion')

//iniciando el express 
const app = express()


//******************TIPOS DE LLAMADOS**********************

//GET: consulta standar para traer datos de la base de datos
app.get('/usuario', vToken, ( req, res ) => {
    
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    Usuario.find({ estado: true }, 'name email role estado google img') //find busca todos los datos y se puede ({poner filtros} y numero de columnas a mostrar)
        .skip(desde)    //Inicio de datos a mostrar
        .limit(limite)   //limita solo 5 datos a mostrar
        .exec( (err,usuarios) =>{   //Ojo se puede poner el callback dento del exe(**) o fuera exe().then(**) 

            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => { //obtener numero de datos
                res.json({
                    ok:true,
                    usuarios,
                    nDatos: conteo
                })
            })
        } )
} )

// POST: Permite mandar/ingresar datos desde el body
app.post('/usuario', [vToken, verificaAdmRol], function ( req, res ) {
    let body = req.body     //obteniendo data body

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        //password: bcrypt.hassyc(body.password, 10),   //encriptando password de body
        password: body.password,
        role: body.role,
    })

    usuario.password = usuario.encryptPassword(body.password),

    usuario.save( (err, usuarioDB) => { //comando de guardado en mongodb

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        })

    } )

} )

//PUT: Edita los datos con los valores de los parametro enviados del url
app.put('/usuario/:id', [vToken, verificaAdmRol], function ( req, res ) {
    let id = req.params.id      //asignando parametro como dato
    let body = _.pick( req.body, ['name', 'email', 'img', 'role', 'estado'] ) //aplica la fltracion de parametro body

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, usuarioDB) => { // permite actualizar datos de  mongo y json(impresion)
        //nota: {new: true} permite que usuarioDB sea el nuevo objeto modificado y no el antiguo
        //{runValidators} permite aplicar las restricciones del screma en el update

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    } )
} )

//DELETE: permite borrar usuario/usuarios 
/*app.delete('/usuario/:id', function ( req, res ) {
    
    let id = req.params.id

    Usuario.findByIdAndRemove( id, (err, usuarioBorrar) => {

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if(usuarioBorrar === null){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        res.json({
            ok:true,
            usuario: usuarioBorrar
        })

    } )

} )*/

//PUT-DELETE: Usa modificar estado para desactivar usuario
app.delete('/usuario/:id', vToken, function ( req, res ) {
    let id = req.params.id      //asignando parametro como dato

    let nuevoEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate( id, nuevoEstado, {new: true}, (err, usuarioDesactivado) => { // permite actualizar datos de mongo y json(impresion)
        //nota: {new: true} permite que usuarioDB sea el nuevo objeto modificado y no el antiguo

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if(usuarioDesactivado === null){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDesactivado
        })

    } )
} )

//EXPORTACIÓN
module.exports = app