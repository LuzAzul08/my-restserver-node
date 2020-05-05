//IMPORTACION
const express = require('express')
const { vToken, verificaAdmRol } = require('../middlewares/autentificacion')

//inicializacion
let app = express()

//Categoria
let Categoria = require('../models/categoria')


//**********ACCIONES***********

//GET: Mostrar todas la categorias
app.get('/categoria', vToken, ( req, res ) => {

    Categoria.find()
    .sort('descripcion') // funcion ordenar: por descripcion
    .populate('usuario', 'name email') // permite llenar la propiedad de usuario y define sus campos
    //.populate('datos2','columna1 columna2') // asi se agraga mas objetos a llenar
        .exec( (err, categorias) => {

            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            Categoria.count((err, conteo) => {
                res.json({
                    ok:true,
                    categorias,
                    nDatos: conteo
                })
            })
        })

})

// //GET: Mostrar una categoria por id
app.get('/categoria/:id', vToken, (req, res) => {
    let id = req.params.id

    Categoria.findById(id, (err, categoriaDB) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El ID no es valido'
                }
            })
        }
        res.json({
            ok:true,
            categoriaDB
        })
    })
})

//POST: Ingresar categorias
app.post('/categoria', vToken, (req, res) => {
    let body = req.body
    console.log(req.ususario)
    let categoria = new Categoria ({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save( (err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        })
    })
})

//PUT: Editar categoria ubicada por id
app.put('/categoria/:id', vToken, (req, res) => {
    let id = req.params.id
    let body = req.body
    let modif = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, modif, { new: true, runValidators: true }, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            categoria: categoriaDB
        })
    })
})

// //DELETE: Borra una categoria por id
app.delete('/categoria/:id',[vToken, verificaAdmRol],(req, res) => {
    id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'La categoria no existe'
                }
            })
        }
        res.json({
            ok:true,
            categoriaDB,
            message: 'categoria borrada'
        })
    })
})



//EXPORTACIONES
module.exports = app