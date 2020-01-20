/** Configuración Global de la aplicación */
process .env .PORT = process .env .PORT || 3000;
process .env .NODE_ENV = process .env .NODE_ENV || 'dev';
/** Mongo DB (Local) / Mongo Atlas (Remote) */
process .env .URI_DB = ( process .env .NODE_ENV === 'dev' ) ?
    'mongodb://localhost:27017/db_cafe' :                            
    process .env .MONGO_URI;     // Versión del driver (Variable de Entorno definida en Heroku): '2.12.0 or later' (3.0 or later no funciona)

// Versión del driver (Variable de Entorno definida en Heroku): '2.12.0 or later' (3.0 or later no funciona)
//process .env .URI_DB = process .env .MONGO_URI;

