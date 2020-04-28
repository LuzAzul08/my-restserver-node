
//Configuración de puerto 
process.env.PORT = process.env.PORT || 3000


//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// Definiendo la conexion a la Base de datos
let urlDB
console.log(process.env.NODE_ENV);
if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/store'
}else {
    urlDB = process.env.MONGO_ATLAS_URL
}

process.env.URLDB = urlDB