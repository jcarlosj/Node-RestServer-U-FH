const express = require( 'express' ),
      app = express();

/** Muestra todas las categorías */
app .get( '/categoria', ( request, response ) => {
    response .json({ 
        success: true,
        message: 'GET /categoria'
    });
});

/** Muestra una categoría por ID */
app .get( '/categoria/:id', ( request, response ) => {
    response .json({
        success: true,
        message: 'GET /categoria/' + request .params .id
    });
});

/** Crea categoría */
app .post( '/categoria', ( request, response ) => {
    response .json({
        success: true,
        message: 'POST /categoria'
    });
});

/** Actualizar categoría */
app .put( '/categoria/:id', ( request, response ) => {
    response .json({
        success: true,
        message: 'PUT /categoria/' + request .params .id
    });
});

/** Elimina Categoría 
 * Solo un Administrador puede borrar una categoría
*/
app .delete( '/categoria/:id', ( request, response ) => {
    response .json({
        success: true,
        message: 'DELETE /categoria/' + request .params .id
    });
});

module .exports = app;