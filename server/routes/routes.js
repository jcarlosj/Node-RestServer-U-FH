const express = require( 'express' ),
      app = express();    // Importa el modelo de Usuario

/** Routes using Middlewares */
app .use( require( './usuario' ) );
app .use( require( './login' ) );
app .use( require( './categoria' ) );

module .exports = app;