const express = require( 'express' ),
      app = express();

/** Middleware */
app .use( express .json() );                            // Analiza las solicitudes entrantes con cargas JSON
app .use( express .urlencoded({ extended: true }));     // para analizar application/x-www-form-urlencoded

/** Routes */
app .get( '/usuario', ( request, response ) => {
    response .json({ 'message': 'get /usuario' });
});

app .post('/usuario', ( request, response ) => {
    const { name, age } = request .body;
    
    if( name === undefined ) {
        response .status( 400 ) .json({
            success: false,
            message: 'name is required'
        });
    }
    else {
        response .json({ 
            success: true,
            'message': 'put /usuario',
            'user': request.body
        });
    }
});

app .put( '/usuario/:id', ( request, response ) => {
    let user_id = request .params .id;
    response .json({ 
        'message': 'post /usuario',
        user_id  
    });
});

app .delete( '/usuario/:id', ( request, response ) => {
    response .json({ 
        'message': 'delete /usuario',
        'user_id': request .params .id  
    });
});

/** Lanza el Servidor */
app .listen( 3000, () => {
    console .log( 'Servidor escuchando en el puerto ', 3000 );
});