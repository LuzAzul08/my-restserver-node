//EL USAR PROCESS NO REQUIERE IMPORTAR EN OTROS ARCHIVOS PUES ESTA VARIABLE ES GLOBAL


//Configuración de puerto 
process.env.PORT = process.env.PORT || 3000


//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//Tiempo vencimiento del token
process.env.CADUCIDAD_TOKEN = '12h'


//SEED de autentificacion
process.env.SEED = process.env.SEED || 'token-secreto-desarrollo'


// Definiendo la conexion a la Base de datos
let urlDB
console.log(process.env.NODE_ENV);
if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/store'
}else {
    urlDB = process.env.MONGO_ATLAS_URL
}

process.env.URLDB = urlDB