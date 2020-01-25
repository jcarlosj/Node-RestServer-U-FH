const express = require( 'express' ),
      app = express(),
      /** Modulos Nativos de Node */
      fs = require( 'fs' ),         // Permite interactuar con los archivos del sistema de manera similar a POXIS
      path = require( 'path' ),     // Modulo Nativo de 
      /** Dependencias */
      fileUpload = require( 'express-fileupload' )
      /** Modelos o Schemas Requeridos */
      User = require( '../models/usuario' ),    // Importa el modelo 
      Product = require( '../models/producto' ),    // Importa el modelo 

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

        /** En este momento el archivo se encuentra subido al sistema */
        console .group( 'Imagen subida con exito' );
        console .log( `schema: ${ model }` );
        console .log( `originalFileName: ${ file .name }` );
        console .log( `newFileName: ${ newFileName }` );
        console .groupEnd();

        /** Registra imagen subida */
        registerUserImage( id, response, newFileName );

    });

});

/** Registra imagen de usuario subida */
let registerUserImage = ( id, response, newFileName ) => {

    /** Busca el Usuario */
    User .findById( id, ( error, usuarioDB ) => {
        /** Valida Error de Bases de datos */
        if( error ) {
            deleteFile( newFileName, 'usuarios' );   // Eliminar Archivo Subido

            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Handle: No encuentra el usuario */
        if( ! usuarioDB ) {
            deleteFile( newFileName, 'usuarios' );   // Eliminar Archivo Subido

            return response .status( 400 ) .json({
                success: false,
                error: {
                    message: 'El usuario NO existe'
                }
            });
        }

        deleteFile( usuarioDB .img, 'usuarios' );   // Eliminar Archivo de Imagen de Usuarios

        /** Asigna nombre de la imagen a propiedad img del Modelo Usuarios */
        usuarioDB .img = newFileName;                      

        /** Registra nombre de la imagen en la BD */
        usuarioDB .save( ( error, usuarioGuardado ) => {
            /** Valida Error de Bases de datos */
            if( error ) {
                return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                    success: false,
                    error
                });
            }

            /** Retorna la respuesta (siempre que no ocurra un error) */
            response .json({
                success: true,
                img: newFileName,
                user: usuarioGuardado
            });
        });

    });
}

/** Elimina Archivo existente */
let deleteFile = ( fileName, model ) => {
    let pathFile = path .resolve( __dirname, `../../uploads/${ model }/${ fileName }` );    // Resuelve secuencia de rutas o segmentos de ruta en una ruta absoluta

    if( fs .existsSync( pathFile ) ) {      // Valida (de forma sincrona) si existe un archivo
        fs .unlinkSync( pathFile );         // Elimina archivos del sistema
    }
}

module .exports = app;