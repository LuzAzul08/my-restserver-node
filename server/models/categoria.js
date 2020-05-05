//IMPORTACION
const  { Schema, model } = require('mongoose')

//Definiendo el modelo en una variable
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria'],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})


//EXPORTACIONES
module.exports = model('Categoria', categoriaSchema)