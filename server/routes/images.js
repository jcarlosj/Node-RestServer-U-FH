const express = require( 'express' ),
      app = express(),
      /** Modulos Nativos de Node */
      fs = require( 'fs' ),         // Permite interactuar con los archivos del sistema de manera similar a POXIS
      path = require( 'path' );     // Para convertir a rutas absulutas

/** Obtener imagenes */
app .get( '/imagen/:model/:img', ( request, response ) => {
    let model = request .params .model,
        img = request .params .img,
        pathImageFile = `./uploads/${ model }/${ img }`,
        noImagePath = path .resolve( __dirname, '../assets/images/no-image.png' );

    response .sendFile( noImagePath );  // Despliega Imagen no encontrada

});

module .exports = app;