//Importaciones
require('./config/config') // se ejecuta y mantiene las variables como globales
const express = require('express')
const bodyParser = require('body-parser')


//iniciando el express
const app = express()

// funciones activadas al realizar una peticion
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Tipos de consultas a servidor
app.get('/', function ( req, res ) {
    res.json('Home o pantalla principal')
} )
app.get('/usuario', function ( req, res ) {
    res.json('get de ususarios')
} )

//******************Tipos de consultas**********************

// POST: permite obtener parametros mandados desde body
app.post('/usuario', function ( req, res ) {
    let body = req.body     //obteniendo data body
    if( body.nome ===undefined ){
        res.status(400).json({
            ok: false,
            mensaje: 'Se requiere el parametro "name"'
        })
    }else{
        res.json({
            persona: body
        })
    }
} )

//PUT: este permite usar como dato el parametro del url
app.put('/usuario/:id', function ( req, res ) {
    let id = req.params.id      //asignando parametro como dato
    res.json({
        id
    })
} )

//DELETE
app.delete('/usuario', function ( req, res ) {
    res.json('delete de ususario')
} )

//LISTEN
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000');
})

