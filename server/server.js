require ( './config/config' );

const express = require( 'express' ),
      app = express(),
      mongoose = require( 'mongoose' );                  // ODM (Object Document Mapping) by MongoDB

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
    autoReconnect: true,
    reconnectTries: 1000000,
    reconnectInterval: 3000
  })
}

run() .catch( error => console .error( error ) );

/** Lanza el Servidor */
app .listen( process .env .PORT, () => {
    console  .log ( 'Escuchando en http://localhost:' + process .env .PORT );
});