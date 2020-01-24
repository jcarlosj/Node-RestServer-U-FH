const express = require( 'express' ),
      app = express();    // Importa el modelo de Usuario

/** Routes using Middlewares */
app .use( require( './usuario' ) );
app .use( require( './login' ) );
app .use( require( './categoria' ) );
app .use( require( './producto' ) );
app .use( require( './upload' ) );

module .exports = app;