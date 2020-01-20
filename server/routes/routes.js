const express = require( 'express' ),
      app = express();    // Importa el modelo de Usuario

/** Routes */
app .use( require( './usuario' ) );
app .use( require( './login' ) );

module .exports = app;