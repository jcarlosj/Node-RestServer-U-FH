const express = require( 'express' ),
      app = express();

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
            'message': 'post /usuario',
            'user': request.body
        });
    }
});

app .put( '/usuario/:id', ( request, response ) => {
    let user_id = request .params .id;
    response .json({ 
        'message': 'put /usuario',
        user_id  
    });
});

app .delete( '/usuario/:id', ( request, response ) => {
    response .json({ 
        'message': 'delete /usuario',
        'user_id': request .params .id  
    });
});

module .exports = app;