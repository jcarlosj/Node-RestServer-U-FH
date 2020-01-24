const express = require( 'express' ),
      app = express(),
      /** Dependencias */
      fileUpload = require( 'express-fileupload' );

/** Middleware (Default options) */
app .use( fileUpload() );
    
/** Subir/Actualizar Imagenes 
 *  - :model > Hace referencia al Modelo o Schema que requiere la subida de una imagen
 *  - :id    > Hace referencia al registro al que ser'a asignado dicho archivo
*/
app .put( '/upload/:model/:id', ( request, response ) => {      
    let model = request .params .model,
        id = request .params .id;

    /** Valida si NO hay archivos */
    if( ! request .files ) {
        return response .status( 400 ) .json({
            success: false,
            error: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    /** Valida el Modelo o Schema que requiere la subida del archivo */
    let allowedModels = [ 'usuarios', 'productos' ];    // Modelo o Schema permitidos (Los ponemos para que hagan Match con el nombre de los directorios, que contendran los archivos)

    /** Valida que NO ha encontrado el Modelo o Schema permitido */
    if( 0 > allowedModels .indexOf( model ) ) {
        return response .status( 400 ) .json({
            success: false,
            error: {
                schema: model,
                message: `Los Modelos o Schemas permitidos son: ${ allowedModels .join( ', ' ) }`
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

    /** Cambiar el nombre del archivo */
    let newFileName = `${ id }-${ new Date() .getTime() }.${ fileExtension }`;      // Para evitar problemas de cache por el renombre de un archivo con el mismo nombre y evitar que no refresque correctamente usamos la fecha representada en milisegundos de manera que siempre seran diferentes
 
    /** Subir el Archivo */
    file .mv( `./uploads/${ model }/${ newFileName }`, ( error ) => {
        /** Valida Error de subida de archivo */
        if( error ) {
            return response .status( 500 ) .json({
                success: false,
                error
            });
        }

        /**  */

        /** Retorna la respuesta (siempre que no ocurra un error) */
        response .json({
            success: true,
            schema: model,
            fileName: file .name,
            newFileName: newFileName,
            message: 'Imagen subida correctamente'
        });

    });

});

module .exports = app;