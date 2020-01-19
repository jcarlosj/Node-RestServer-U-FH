const express = require( 'express' ),
      app = express(),
      /** Dependencias */
      bcrypt = require( 'bcryptjs' ),             // Encriptar contraseñas
      _ = require( 'underscore' ),                // Librería que proporciona funciones de utilidad para tareas de programación comunes.
      /** Modelos Requeridos */
      User = require( '../models/usuario' );    // Importa el modelo de Usuario

app .get( '/usuario', ( request, response ) => {
    let since = Number( request .query .since ) || 0,
        limit = Number( request .query .limit ) || 5;

    activeUsersOnly = {
        status: true
    }
        
    User .find( activeUsersOnly, 'name email img role status google' )   // Filtra campos que se desean obtener (mostrar) con usuarios que tienen estado activo
        .skip( since )      // Número de documentos por salto (Filtro para paginar datos)
        .limit( limit )     // Número límite que mostrará (Filtro para paginar datos)
        .exec( ( error, usuarios ) => {
            if( error ) {
                return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                    success: false,
                    error
                });
            }

            /** Cuenta cantidad total de registros en la BD con usuarios que tienen estado activo */
            User .countDocuments( activeUsersOnly, ( err, counter ) => {  /** count() estará obsoleto en las próximas versiones, recomiendan usar en su lugar: collection.countDocuments o collection.estimatedDocumentCount */

                response .json({
                    success: true,
                    count: counter,
                    limit: usuarios .length,        // Cuenta cantidad de registros para mostrar
                    usuarios
                });

            });

        });
});

/** Crea un recurso (un usuario) */
app .post( '/usuario', ( request, response ) => {
    const { name, age, email, password, role } = request .body;        // Obtenemos los datos enviados de la petición (usando el concepto de Destructuración)
    
    /** Crea Instancia de tipo Usuario y asigna sus valores */
    let user = new User({
        name,
        age,
        email,
        password: bcrypt .hashSync( password, 10 ),
        role
    });      

    /** Registra los datos en MongoDB */
    user .save( ( error, responseDB ) => {
        if( error ) {
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({        // Cuando no se coloca el status Node asume implicitamente que fue exitosa la petición y el estado será 200 por defecto
            success: true,
            user: responseDB
        });

    });
});

app .put( '/usuario/:id', ( request, response ) => {
    let user_id = request .params .id,                          // Obtenemos los parámetros enviados (GET)
        body = _ .pick( request .body, [ 'name', 'email', 'img', 'role', 'status' ]);   // Filtra datos enviados del 'body' obteniendo solo los valores de los campos permitidos (POST)
    /** NOTA: La línea anterior eliminó las propiedades (password, google) del objeto 'body' para evitar que se puedan actualizar estos campos */

    /** Actualiza los datos en MongoDB */
    User .findByIdAndUpdate( user_id, body, { new: true, runValidators: true }, ( error, responseDB ) => {   // findByIdAndUpdate(id, update, options, callback) - { new: true } 'true' devuelve el documento modificado en lugar del original. por defecto es 'false'
        if( error ) {
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({        // Cuando no se coloca el status Node asume implicitamente que fue exitosa la petición y el estado será 200 por defecto
            success: true,
            user: responseDB
        });

    });

});

app .patch( '/usuario/:id', ( request, response ) => {
    let user_id = request .params .id,      // Obtiene el id del usuario enviado como parámetro por la URL (GET)
        changeStatus = { status: false };

    User .findByIdAndUpdate( user_id, changeStatus, { new: true }, ( error, responseDB ) => {
        if( error ) {
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({ 
            success: true,
            user: responseDB
        });
    });

});

app .delete( '/usuario/:id', ( request, response ) => {
    let user_id = request .params .id;      // Obtiene el id del usuario enviado como parámetro por la URL (GET)

    User .findByIdAndRemove( user_id, ( error, responseDB ) => {
        if( error ) {
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        if( ! responseDB ) {        // ! responseDB o responseDB === null (funciona igual)
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error: { 
                    message: 'Usuario no encontrado'
                }
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({ 
            success: true,
            user: responseDB
        });
    });

});

module .exports = app;