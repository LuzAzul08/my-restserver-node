//IMPORTACIONES
const express = require('express')  //Permite administrar un servidor en un puerto

//iniciando el express
const app = express()

app.use( require('./daoUsuario') )
app.use( require('./login') )
app.use( require('./daoCategoria') )
app.use( require('./daoProducto') )

module.exports = app