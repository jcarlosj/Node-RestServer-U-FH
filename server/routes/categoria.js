const express = require( 'express' ),
      app = express(),
      /** Modelos Requeridos */
      Category = require( '../models/categoria' ),    // Importa el modelo de Usuario
      /** Middleware Autenticación */
      { validateToken, validateAdminRole } = require( '../middlewares/authentication' );

/** Muestra todas las categorías */
app .get( '/categoria', validateToken, ( request, response ) => {
    let { _id, name, email, role } = request .user;      // Obtiene datos del PayLoad (Destructuración) 

    //console .log( 'user', request .user );

    Category .find({}, 'name description user' )   // Filtra campos que se desean obtener (mostrar)
        .populate( 'user', 'name email role' )     // Popular datos del campo 'user' con el Modelo Usuario y de este solo mostrar los campos '_id', 'name', 'role' e 'email'
        .exec( ( error, categorias ) => {

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
                count: categorias .length,
                categorias
            });
          
        });
    
});

/** Muestra una categoría por ID */
app .get( '/categoria/:id', validateToken, ( request, response ) => {
    let { _id, name, email, role } = request .user,      // Obtiene datos del PayLoad (Destructuración) 
        id = request .params .id;

    Category .findOne({
        _id: id
    }, ( error , categoryDB ) => {
        if( error ) {
            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({        // Cuando no se coloca el status Node asume implicitamente que fue exitosa la petición y el estado será 200 por defecto
            success: true,
            authenticated_user: {
                _id,
                name,
                email,
                role
            },
            category: categoryDB
        });

    });
    
});

/** Crea categoría */
app .post( '/categoria', validateToken, ( request, response ) => {
    const { name, description } = request .body;        // Obtenemos los datos enviados de la petición (usando el concepto de Destructuración)

    let category = new Category({ 
        user: request .user ._id, 
        name, 
        description
    });

    /** Registra los datos en MongoDB */
    category .save( ( error, categoryDB ) => {
        if( error ) {
            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Handle: No registra categoría */
        if( ! categoryDB ) {
            return response .status( 400 ) .json({
                success: false,
                error
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({
            success: true,
            authenticated_user: {
                _id: request .user ._id,
                name: request .user .name,
                email: request .user .email,
                role: request .user .role
            },
            category: categoryDB
        });

    });

});

/** Actualizar categoría */
app .put( '/categoria/:id', validateToken, ( request, response ) => {
    let { _id, name, email, role } = request .user,      // Obtiene datos del PayLoad (Destructuración) 
        category_id = request .params .id,  // Obtenemos los parámetros enviados (GET)
        body = request .body;               // Obtenermos los valores enviados (POST)

    Category .findByIdAndUpdate( category_id, body, { new: true, runValidators: true }, ( error, categoryDB ) => {   // findByIdAndUpdate(id, update, options, callback) - { new: true } 'true' devuelve el documento modificado en lugar del original. por defecto es 'false'
        if( error ) {
            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        if( ! categoryDB ) {        // ! categoryDB o categoryDB === null (funciona igual)
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error: { 
                    message: 'Categoría no encontrada'
                }
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({        // Cuando no se coloca el status Node asume implicitamente que fue exitosa la petición y el estado será 200 por defecto
            success: true,
            authenticated_user: {
                _id,
                name,
                email,
                role
            },
            user: categoryDB
        });
    });
});

/** Elimina Categoría 
 * Solo un Administrador puede borrar una categoría
*/
app .delete( '/categoria/:id', [ validateToken, validateAdminRole ], ( request, response ) => {
    let { _id, name, email, role } = request .user,      // Obtiene datos del PayLoad (Destructuración) 
        category_id = request .params .id;      // Obtiene el id del usuario enviado como parámetro por la URL (GET)

    Category .findByIdAndRemove( category_id, ( error, categoryDB ) => {
        if( error ) {
            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        if( ! categoryDB ) {        // ! categoryDB o categoryDB === null (funciona igual)
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error: { 
                    message: 'Categoría no encontrada'
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
            user: categoryDB
        });

    });

});

module .exports = app;