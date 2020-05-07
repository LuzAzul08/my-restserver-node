//IMPORTACIONES
const express = require('express')
const fs = require('fs')
const path = require('path')
const { vTokenImg } = require('../middlewares/autentificacion')

//LEVANTANDO EL SERVIDOR
const app = express()

/* **********ACCIONES********** */ 

//GET: mostrar
app.get('/imagen/:tipo/:img', vTokenImg, ( req, res ) => {
    let tipo = req.params.tipo
    let img = req.params.img

    let pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ img }`)

    if(fs.existsSync(pathImagen)){
        res.sendFile( pathImagen )
    }else {
        let ubImgPath = path.resolve( __dirname, '../assets/no-image.jpg' )
        res.sendFile(ubImgPath)
    }

    

})


//EXPORT
module.exports = app