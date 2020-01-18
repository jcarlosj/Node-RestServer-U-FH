require ( './config/config' );

const express = require( 'express' ),
      app = express(),
      mongoose = require( 'mongoose' );                  // ODM (Object Document Mapping) by MongoDB

/** Middleware */
app .use( express .json() );                            // Analiza las solicitudes entrantes con cargas JSON
app .use( express .urlencoded({ extended: true }));     // para analizar application/x-www-form-urlencoded

/** Routes */
app .use( require( './routes/usuario' ) );              // Requiere el archivo de rutas de usuario

/** Conexión a Base de Datos MongoDB con Mongoose usando async/await */
mongoose .Promise = Promise;

mongoose .connection .on( 'connected', () => {
  console .log( 'MongoDB: Connection Established' );
})

mongoose .connection .on( 'reconnected', () => {
  console .log( 'MongoDB: Connection Reestablished' );
})

mongoose .connection .on( 'disconnected', () => {
  console .log( 'MongoDB: Connection Disconnected' );
})

mongoose .connection .on( 'close', () => {
  console .log( 'MongoDB: Connection Closed' );
})

mongoose .connection .on( 'error', ( error ) => {
  console .log( 'ERROR: ' + error );
})

const run = async () => {
  await mongoose .connect( 'mongodb://localhost:27017/db_cafe', {
    useNewUrlParser: true,
    useCreateIndex: true,       // Falso por defecto. Configurado para truehacer que la compilación de índice predeterminada de Mongoose se use en createIndex()
    useNewUrlParser: true,      // Bandera para permitir a los usuarios recurrir al antiguo analizador (Controlador DB MongoDB)
    useFindAndModify: false,    // Configurado para false hacer findOneAndUpdate() y findOneAndRemove() usar nativo en findOneAndUpdate() lugar de findAndModify()
    useUnifiedTopology: true    // Configura nuevo motor de topología de Mongoose
  })
}

run() .catch( error => console .error( error ) );

/** Lanza el Servidor */
app .listen( process .env .PORT, () => {
    console  .log ( 'Escuchando en http://localhost:' + process .env .PORT );
});