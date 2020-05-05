//EL USAR PROCESS NO REQUIERE IMPORTAR EN OTROS ARCHIVOS PUES ESTA VARIABLE ES GLOBAL


//Configuración de puerto 
process.env.PORT = process.env.PORT || 3000


//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//Tiempo vencimiento del token
process.env.CADUCIDAD_TOKEN = '12h'


//SEED de autentificacion
process.env.SEED = process.env.SEED || 'token-secreto-desarrollo'


//GOOGLE Cliente ID: lo provee google para acceder por cuenta google con GOOGLE APIS
//https://console.developers.google.com/apis/credentials?authuser=0&project=my-project-1588475367949
process.env.CLIEND_ID = process.env.CLIENT_ID || '942289765984-uk2ltm6507esfbpa332n4j0t2tv4uej9.apps.googleusercontent.com'


// Definiendo la conexion a la Base de datos
let urlDB
console.log(process.env.NODE_ENV);
if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/store'
}else {
    urlDB = process.env.MONGO_ATLAS_URL
}

process.env.URLDB = urlDB