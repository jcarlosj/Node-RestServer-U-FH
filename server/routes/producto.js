const express = require( 'express' ),
      app = express()
      /** Modelos Requeridos */
      Product = require( '../models/producto' ),    // Importa el modelo
      /** Middleware Autenticación */
      { validateToken, validateAdminRole } = require( '../middlewares/authentication' );

/** Muestra todas las productos */
app .get( '/producto', validateToken, ( request, response ) => {
    const { _id, name, email, role } = request .user;

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
                authenticated_user: {
                    _id,
                    name,
                    email,
                    role
                },
                product: productos
            });

        });

});

/** Muestra una producto por ID */
app .get( '/producto/:id', validateToken, ( request, response ) => {
    let { _id, name, email, role } = request .user,
        id = request .params .id;

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
            authenticated_user: {
                _id,
                name,
                email,
                role
            },
            product: productDB
        });
    });

});

/** Crea producto */
app .post( '/producto', validateToken, ( request, response ) => {
    const { _id, name: name_user, email, role } = request .user,
          { name: name_product, description, unitPrice, category, available } = request .body,        // Obtenemos los datos enviados de la petición (usando el concepto de Destructuración)
          product = new Product({
              name: name_product,
              description, 
              unitPrice,
              category,
              available,
              user: _id
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
        response .status( 201 ) .json({
            success: true,
            authenticated_user: {
                _id,
                name: name_user,
                email,
                role
            },
            product: productDB
        });
    });

});

/** Actualizar producto */
app .put( '/producto/:id', validateToken, ( request, response ) => {   // findByIdAndUpdate(id, update, options, callback)
    let { _id, name, email, role } = request .user,
        product_id = request .params .id,   // Obtenemos los parámetros enviados (GET)
        body = request .body;               // Obtenermos los valores enviados (POST)

    Product .findByIdAndUpdate( product_id, body, { new: true, runValidators: true }, ( error, productDB ) => {
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
            authenticated_user: {
                _id,
                name,
                email,
                role
            },
            product: productDB
        });

    });

});

/** Actualizar disponibilidad del producto */
app .patch( '/producto/:id', validateToken, ( request, response ) => {
    let { _id, name, email, role } = request .user,
        product_id = request .params .id,   // Obtenemos los parámetros enviados (GET)
        changeAvailability = { available: false };

    Product .findByIdAndUpdate( product_id, changeAvailability, { new: true }, ( error, productDB ) => {
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
            authenticated_user: {
                _id,
                name,
                email,
                role
            },
            user: productDB
        });

    });

});

/** Elimina producto 
 * Solo un Administrador puede borrar una producto
*/
app .delete( '/producto/:id', [ validateToken, validateAdminRole ], ( request, response ) => {
    let { _id, name, email, role } = request .user,      // Obtiene datos del PayLoad (Destructuración) 
        product_id = request .params .id;   // Obtenemos los parámetros enviados (GET)

    Product .findByIdAndRemove( product_id, { new: true }, ( error, productDB ) => {
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
            authenticated_user: {
                _id,
                name,
                email,
                role
            },
            user: productDB
        });

    });

});

module .exports = app;