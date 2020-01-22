/** Configuración Global de la aplicación */
process .env .PORT = process .env .PORT || 3000;
process .env .NODE_ENV = process .env .NODE_ENV || 'dev';

/** Configuración para los Tokens 
 * 60 segundos, 60 minutos, 24 horas, 30 días
*/
process .env .TOKEN_EXPIRATION_DATE = 60 * 60 * 24 * 30;                 // Fecha vencimiento del Token (30 días)
process .env .SEED = process .env .SEED || 'secret-development-string';  // Key or Seed (No olvidar configurar variable de entorno en producción).

/** Mongo DB (Local) / Mongo Atlas (Remote) */
process .env .URI_DB = ( process .env .NODE_ENV === 'dev' ) ?
    'mongodb://localhost:27017/db_cafe' :                            
    process .env .MONGO_URI;     // Versión del driver (Variable de Entorno definida en Heroku): '2.12.0 or later' (3.0 or later no funciona)

// Versión del driver (Variable de Entorno definida en Heroku): '2.12.0 or later' (3.0 or later no funciona)
//process .env .URI_DB = process .env .MONGO_URI;

/** Google Client ID (by Google Sign-In) */
process .env .CLIENT_ID = process .env .CLIENT_ID || '654197891799-fcm3jr2e25hap2q7i3ik5bnicj3tjjve.apps.googleusercontent.com'; 
