//Importaciones
require('./config/config') // se ejecuta y mantiene las variables como globales
const express = require('express')  //Permite administrar un servidor en un puerto
const bodyParser = require('body-parser')   // permite obtener datos a partir del url
const mongoose = require('mongoose')    //Permite administrar la base de datos MongoDB

//Evitar errores de mongooseDB https://mongoosejs.com/docs/deprecations.html
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)


//iniciando el express
const app = express()

// funciones activadas al realizar una peticion
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use( require('./routes/daoUsuario') )

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

