//IMPORTACIONES
const express = require('express')
const { vToken, verificaAdmRol } = require('../middlewares/autentificacion')
const _ = require('underscore')

//DEFINIENDO
const app = express()

//DEFINIENDO EL MODELO A USAR
let Producto = require('../models/producto')


//**********ACCIONES***********

//GET: Mostrar todas la categorias
app.get('/producto', vToken, ( req, res) => {

    let desde = req.body.desde || 0
    desde = Number(desde)

    Producto.find({disponible: true})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'name email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            Producto.count({disponible: true}, ( err, conteo ) => {
                res.json({
                    ok: true,
                    producto: productoDB,
                    nDatos: conteo
                })
            })
            
        })
})

//GET: Mostrar un producto por id
app.get('/producto/:id', vToken, ( req, res) => {
    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'name email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if(err){
                res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!productoDB){
                res.status(400).json({
                    ok:false,
                    err: {
                        message: 'El ID no existe'
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })
            
        })
})

//GET: Buscar productos por termino
app.get('/producto/buscar/:termino', ( req, res ) => {
    let termino = req.params.termino

    let regex = new RegExp( termino, 'i' ) // Expresion regilar, i: sencible a mayusculas

    Producto.find( { nombre: regex} )
        .populate('categoria', 'descripcion')
        .exec( ( err, productoDB ) => {
            if(err){
                res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!productoDB){
                res.status(400).json({
                    ok:false,
                    err: {
                        message: 'El ID no existe'
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        })

})

//POST: Crear un nuevo producto
app.post('/producto', vToken, ( req, res) => {
    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id /////////////
    })

    producto.save( ( err, productoDB ) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            message: 'Producto creado',
            producto: productoDB
        })
    })
})

//PUT: Actualizar producto
app.put('/producto/:id', vToken, ( req, res) => {
    let id = req.params.id

    let modificacion = _.pick( req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria'])

    Producto.findByIdAndUpdate( id, modificacion, { new: true, runValidators: true }, ( err, productoDB ) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El ID no existe'
                }
            })
        }
        res.json({
            ok: true,
            message: 'Producto ha sido modificado',
            producto: productoDB
        })
    })
})

//DELETE: Eliminar un producto por disponibilidad
app.delete('/producto/:id', vToken, ( req, res) => {
    let id = req.params.id

    let modificacion = {
        disponible: false
    }

    Producto.findByIdAndUpdate( id, modificacion, { new: true }, ( err, productoDB ) => {
        if(err){
            res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            res.status(400).json({
                ok:false,
                err: {
                    message: 'El ID no existe'
                }
            })
        }
        res.json({
            ok: true,
            message: 'El producto ha sido desabilitado',
            producto: productoDB

        })
    })
})


//EXPORTACIONES
module.exports = app