const express = require( 'express' ),
      app = express();

/** Muestra todas las categorías */
app .get( '/producto', ( request, response ) => {
    response .json({
        success: true,
        message: 'GET /producto'
    });
});

/** Muestra una categoría por ID */
app .get( '/producto/:id', ( request, response ) => {
    response .json({
        success: true,
        message: 'GET /producto/' + request .params .id
    });
});

/** Crea categoría */
app .post( '/producto', ( request, response ) => {
    response .json({
        success: true,
        message: 'POST /producto'
    });
});

/** Actualizar categoría */
app .put( '/producto/:id', ( request, response ) => {
    response .json({
        success: true,
        message: 'PUT /producto/' + request .params .id
    });
});

/** Elimina Categoría 
 * Solo un Administrador puede borrar una categoría
*/
app .delete( '/producto/:id', ( request, response ) => {
    response .json({
        success: true,
        message: 'DELETE /producto/' + request .params .id
    });
});

module .exports = app;