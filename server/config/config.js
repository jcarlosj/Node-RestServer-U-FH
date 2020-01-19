/** Configuración Global de la aplicación */
process .env .PORT = process .env .PORT || 3000;
process .env .NODE_ENV = process .env .NODE_ENV || 'dev';
/** Mongo DB (Local) / Mongo Atlas (Remote) */
process .env .URI_DB = ( process .env .NODE_ENV === 'dev' ) ?
    'mongodb://localhost:27017/db_cafe' :                            
    'mongodb://jcarlosj:0pjj2DwlgDPpdp8U@node-cafe-u-fh-shard-00-00-aneaq.mongodb.net:27017,node-cafe-u-fh-shard-00-01-aneaq.mongodb.net:27017,node-cafe-u-fh-shard-00-02-aneaq.mongodb.net:27017/test?ssl=true&replicaSet=Node-Cafe-U-FH-shard-0&authSource=admin&retryWrites=true&w=majority';     // Versión del driver: '2.12.0 or later' (3.0 or later no funciona)

// Versión del driver: '2.12.0 or later' (3.0 or later no funciona)
//process .env .URI_DB = 'mongodb://jcarlosj:0pjj2DwlgDPpdp8U@node-cafe-u-fh-shard-00-00-aneaq.mongodb.net:27017,node-cafe-u-fh-shard-00-01-aneaq.mongodb.net:27017,node-cafe-u-fh-shard-00-02-aneaq.mongodb.net:27017/test?ssl=true&replicaSet=Node-Cafe-U-FH-shard-0&authSource=admin&retryWrites=true&w=majority';

