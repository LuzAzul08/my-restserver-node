//IMPORTACIONES
const jwt = require('jsonwebtoken')

//Verificando TOKENS por header(get)
let vToken = ( req, res, next ) => {

    let token = req.get('token') //obtener header

    jwt.verify( token, process.env.SEED, ( err, decoded ) => {

        if( err ){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token No valido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()

    } )

}

//Verificando TOKENS por url(query)
let vTokenImg = ( req, res, next ) => {
    let token = req.query.token

    jwt.verify( token, process.env.SEED, ( err, decoded ) => {

        if( err ){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token No valido'
                }
            })
        }

        req.usuario = decoded.usuario //se envia el objeto usuario en el req
        next()

    } )
}

//verificando ADMIN_ROL
let verificaAdmRol = ( req, res, next ) => {

    let usuario = req.usuario
    
    if( usuario.role === 'ADMIN_ROLE'){
        next()
    }else {
        return res.json({
            ok:false,
            err: {
                message: 'Usted no es el ADMINISTRADOR'
            }
        })
    }


}




//EXPORTACIONES
module.exports = {
    vToken,
    verificaAdmRol,
    vTokenImg
}