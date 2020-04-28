//IMPORTACIONES
const mongoose = require('mongoose') //Permite administrar la base de datos MongoDB
const uniqueValidator = require('mongoose-unique-validator') //Permite manejar amigablemente las advertencias

//Inicializando el esquema del objetos
let Schema = mongoose.Schema

//definiendo roles validos admitidos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol admitido'
}

//Definiendo el Objeto contenedor de Usuario
let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de usuario es necesario']

    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

//detitar la impresion de ususario en un JSON 
usuarioSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password  //eliminando password de la impresion
    return userObject
}

//definiendo el mensaje de error al reportar usuarios repetidos(correo)
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } )

//EXPORTACIÓN
module.exports = mongoose.model( 'Usuario' , usuarioSchema )