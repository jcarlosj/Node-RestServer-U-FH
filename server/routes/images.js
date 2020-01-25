const express = require( 'express' ),
      app = express(),
      /** Modulos Nativos de Node */
      fs = require( 'fs' ),         // Permite interactuar con los archivos del sistema de manera similar a POXIS
      path = require( 'path' );     // Para convertir a rutas absulutas

/** Obtener imagenes */
app .get( '/imagen/:model/:img', ( request, response ) => {
    let model = request .params .model,
        nameImage = request .params .img,
        noImagePath = path .resolve( __dirname, '../assets/images/no-image.png' ),
        pathImageFile = path .resolve( __dirname, `../../uploads/${ model }/${ nameImage }` );    // Resuelve secuencia de rutas o segmentos de ruta en una ruta absoluta;

    if( fs .existsSync( pathImageFile ) ) {   // Valida (de forma sincrona) si existe un archivo
        response .sendFile( pathImageFile );  // Despliega Imagen Encontrada
    }
    else {
        response .sendFile( noImagePath );    // Despliega Imagen no encontrada
    }

});

module .exports = app;