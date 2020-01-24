const express = require( 'express' ),
      app = express(),
      /** Dependencias */
      fileUpload = require( 'express-fileupload' );

/** Middleware (Default options) */
app .use( fileUpload() );
    
/** Actualizar */
app .put( '/upload', ( request, response ) => {
    /** Valida si NO hay archivos */
    if( ! request .files ) {
        return response .status( 400 ) .json({
            success: false,
            error: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    /** Obtiene nombre campo input-file para subir el archivo */
    let file = request .files .image;


    file .mv( './uploads/image-file.jpg', ( error ) => {
        /** Valida Error de subida de archivo */
        if( error ) {
            return response .status( 500 ) .json({
                success: false,
                error
            });
        }

        /** Retorna la respuesta (siempre que no ocurra un error) */
        response .json({
            success: true,
            message: 'Archivo subido correctamente'
        });

    });

});

module .exports = app;