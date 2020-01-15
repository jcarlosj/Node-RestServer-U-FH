const express = require( 'express' ),
      app = express();

/** Routes */
app .get( '/', ( request, response ) => {
    response .json({ 'message': 'Hello World' });
});

/** Lanza el Servidor */
app .listen( 3000, () => {
    console .log( 'Servidor escuchando en el puerto ', 3000 );
});