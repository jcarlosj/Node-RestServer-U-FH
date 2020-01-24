const express = require( 'express' ),
      app = express(),
      /** Dependencias */
      fileUpload = require( 'express-fileupload' );

/** Middleware (Default options) */
app .use( fileUpload() );
    
/** Subir/Actualizar Imagenes */
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

    /** Procesa el nombre del archivo */
    let file = request .files .image,                               // Obtiene nombre campo input-file para subir el archivo
        allowedExtensions = [ 'png', 'jpg', 'jpeg', 'gif' ],        // Extensiones permitidas
        fileNameExt = file .name .split( '.' ),                     // Divide 'String' del nombre del archivo (nombre, extension)
        fileExtension = fileNameExt[ fileNameExt .length - 1 ];     // Obtiene solo la extension

    console .log( 'fileName', fileNameExt );
    //return;

    /** Valida que no ha encontrado la extensión permitida */
    if( 0 > allowedExtensions .indexOf( fileExtension ) ) {    // indexOf() retorna el primer índice en el que se puede encontrar un elemento dado en el array, ó retorna -1 si el elemento no esta presente.
        return response .status( 400 ) .json({
            success: false,
            error: {
                fileName: file .name,
                message: `Las extensiones permitidas son: ${ allowedExtensions .join( ', ' ) }`
            }
        });
    }

    file .mv( `./uploads/${ file .name }`, ( error ) => {
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
            fileName: file .name,
            message: 'Imagen subida correctamente'
        });

    });

});

module .exports = app;