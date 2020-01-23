const express = require( 'express' ),
      app = express()
      /** Modelos Requeridos */
      Product = require( '../models/producto' );    // Importa el modelo

/** Muestra todas las productos */
app .get( '/producto', ( request, response ) => {

    Product .find({})
        .exec( ( error, productos ) => {
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
                count: productos .length,
                product: productos
            });

        });

});

/** Muestra una producto por ID */
app .get( '/producto/:id', ( request, response ) => {
    let id = request .params .id;

    Product .findOne({
        _id: id
    }, ( error, productDB ) => {
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
            product: productDB
        });
    });

});

/** Crea producto */
app .post( '/producto', ( request, response ) => {
    const { name, description, unitPrice, available } = request .body,        // Obtenemos los datos enviados de la petición (usando el concepto de Destructuración)
          product = new Product({
              name,
              description, 
              unitPrice,
              available
          });

    /** Resgistra los datos en Mongo DB */
    product .save( ( error, productDB ) => {
        /** Valida Error de Bases de datos */
        if( error ) {
            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Handle: No registra producto */
        if( ! productDB ) {
            return response .status( 400 ) .json({
                success: false,
                error
            });
        }

        /** Retorna la respuesta (siempre que no ocurra un error) */
        response .json({
            success: true,
            product: productDB
        });
    });

});

/** Actualizar producto */
app .put( '/producto/:id', ( request, response ) => {   // findByIdAndUpdate(id, update, options, callback)
    let product_id = request .params .id,   // Obtenemos los parámetros enviados (GET)
        body = request .body;               // Obtenermos los valores enviados (POST)

    Product .findByIdAndUpdate( product_id, body, ( error, productDB ) => {
        /** Valida Error de Bases de datos */
        if( error ) {
            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Handle: No registra producto */
        if( ! productDB ) {
            return response .status( 400 ) .json({
                success: false,
                error: { 
                    message: 'Producto no encontrado'
                }
            });
        }

        /** Retorna la respuesta (siempre que no ocurra un error) */
        response .json({
            success: true,
            product: productDB
        });

    });

});

/** Actualizar disponibilidad del producto */
app .patch( '/producto/:id', ( request, response ) => {
    let product_id = request .params .id,   // Obtenemos los parámetros enviados (GET)
        changeAvailability = { available: false };

    Product .findByIdAndUpdate( product_id, changeAvailability, ( error, productDB ) => {
        /** Valida Error de Bases de datos */
        if( error ) {
            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({ 
            success: true,
            user: productDB
        });

    });

});

/** Elimina producto 
 * Solo un Administrador puede borrar una producto
*/
app .delete( '/producto/:id', ( request, response ) => {
    let product_id = request .params .id;   // Obtenemos los parámetros enviados (GET)

    Product .findByIdAndRemove( product_id, ( error, productDB ) => {
        /** Valida Error de Bases de datos */
        if( error ) {
            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Handle: No registra producto */
        if( ! productDB ) {
            return response .status( 400 ) .json({
                success: false,
                error: { 
                    message: 'Producto no encontrado'
                }
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({ 
            success: true,
            user: productDB
        });

    });

});

module .exports = app;