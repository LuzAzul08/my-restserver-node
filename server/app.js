//Importaciones
require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//Evitar errores de mongooseDB https://mongoosejs.com/docs/deprecations.html
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)


//iniciando el express
const app = express()

// funciones activadas al realizar una peticion
app.use(bodyParser.urlencoded({ extended: false })) //false: no permite manejar objetos anidados
app.use(bodyParser.json()) // activa usar body-parser


//Configuración global de rutas
app.use( require('./routes/index') )


//permite connectarse a mongodb
mongoose.connect(
    process.env.URLDB, //variable delarchivo config.js
    { useNewUrlParser: true,useUnifiedTopology: true },
    ( err, res ) => {
        if(err) throw err
        console.log(`Se ha conectado la Base de datos`);
    }
)

//Asignación y detalle del puerto usado 
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000');
})

