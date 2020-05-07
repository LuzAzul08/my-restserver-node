//IMPORTACIONES
const express = require('express')
const fileUpload = require('express-fileupload')

const usuario = require('../models/usuario')
const producto = require('../models/producto')

const fs = require('fs')    // manejo de archivos
const path = require('path') //ubicar archivo por ruta

//LEVANTANADO EL SERVIDOR
const app = express()

//APLICANDO OPCIONES DE SERVIDOR
app.use(fileUpload())

/* ********** ACCIONES ************** */

//POST: guardar
app.post('/upload/:tipo/:id', ( req, res ) => {

    let tipo = req.params.tipo
    let id = req.params.id

    if( !req.files ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No seleccionó ningun archivo'
            }
        })
    }

    //validar tipo
    let tiposValidos = ['producto', 'usuario']
    if(!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos validos son ${tiposValidos}`
            },
            tipo
        })
    }

    //obteniendo archivo
    let archivo = req.files.archivo

    //validando extensiones
    let nameFile = archivo.name.split('.')
    let extension = nameFile[nameFile.length - 1]
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    if( !extensionesValidas.includes(extension) ){
        return res.status(400).json({
            ok:false,
            err: {
                message: `La expensiones permitidas son: ${extensionesValidas}`,
                ext: extension
            }
        })
    }

    //Cambiando nombre archivo
    let nuevoNameArchivo =`${ id }-${ new Date().getMilliseconds() }.${extension}`

    //Guandando el archivo a un destino
    archivo.mv(`uploads/${tipo}/${nuevoNameArchivo}`, ( err ) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        
        //odificando la bd usuario
        modificarImg( id, res, nuevoNameArchivo, tipo )
    })
    
})

function modificarImg( id, res, nuevoNameArchivo, tipo ){
    let objeto
    if(tipo === 'usuario'){
        objeto = usuario
    }else {
        objeto = producto
    }

    objeto.findById(id, ( err, objetoDB) => {
        if(err){
            borrarArchivo( nuevoNameArchivo, tipo)
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!objetoDB){
            borrarArchivo( nuevoNameArchivo, tipo)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID de usuario no existe'
                }
            })
        }

        //verificando si ya posee una imagen
        borrarArchivo( objetoDB.img, tipo )

        objetoDB.img = nuevoNameArchivo

        objetoDB.save( ( err, objetoGuardado ) => {
            res.json({
                ok: true,
                objeto: objetoGuardado
            })
        })


    })
}

function borrarArchivo( nameImg, tipo){
    let pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ nameImg }`)
    if( fs.existsSync(pathImagen) ){
        fs.unlinkSync(pathImagen)
    }
}


//EXPORTACIONES
module.exports = app