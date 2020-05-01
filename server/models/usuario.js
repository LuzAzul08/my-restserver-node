//IMPORTACIONES
const { Schema, model } = require('mongoose')
const bcryptjs = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator') //Permite manejar amigablemente las advertencias

//definiendo roles validos admitidos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol admitido'
}

//Esquema
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

//Eliminar propiedad password de la impresion json
usuarioSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password  //eliminando password de la impresion
    return userObject
}

//funcion de encriptado de password
usuarioSchema.methods.encryptPassword = async ( password ) => {
    const salt = await bcryptjs.genSalt( 10 )
    return await bcryptjs.hash( password,salt )
}

//desencriptado de password
usuarioSchema.methods.matchPassword = async function( password ){
    return await bcryptjs.compare( password, this.password)
}

//definiendo el mensaje de error al reportar usuarios repetidos(correo)
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } )



//EXPORTACIÓN
module.exports = model( 'Usuario' , usuarioSchema )