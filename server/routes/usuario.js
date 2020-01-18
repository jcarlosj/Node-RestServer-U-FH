const express = require( 'express' ),
      app = express(),
      bcrypt = require( 'bcryptjs' ),             // Dependencia para encriptar contraseñas
      User = require( '../models/usuario' );    // Importa el modelo de Usuario

app .get( '/usuario', ( request, response ) => {
    response .json({ 'message': 'get /usuario' });
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
        body = request .body;   // Obtenermos los valores enviados (POST)

    /** Forma 1 */
    // User .findById( user_id, ( error, responseDB ) => {
    //     /** Valida si el usuario existe */
    //     if( error ) {
    //         return response .status( 404 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
    //             success: false,
    //             error,
    //             message: 'Not Found'
    //         });
    //     }

    //     /** Valida si la contraseña es igual */
    //     const equalPassword = bcrypt .compare( body .password, responseDB .password, ( err, isMatch ) => {
    //         if ( err ) {
    //             throw err;
    //         } 
    //         else {
    //             console .log( 'isMatch', isMatch );
    //             if( isMatch ) {
    //                 body .password = bcrypt .hashSync( body .password, 10 );
    //             }
    //             return isMatch;
    //         }
    //     });
    
    //     /** Asigna datos entre objeto del 'body' y el obejto de respuesta de Mongo */
    //     responseDB .name     = ( responseDB .name === body .name || body .name === null ) ? responseDB .name : body .name ;
    //     responseDB .email    = ( responseDB .name === body .email || body .email === null ) ? responseDB .email : body .email;
    //     responseDB .password = ( equalPassword ) ? responseDB .password : body .password; 
    //     responseDB .img      = ( responseDB .name === body .img || body .img === null ) ? responseDB .img : body .img;
    //     responseDB .role     = ( responseDB .name === body .role || body .role === null ) ? responseDB .role : body .role;
    //     responseDB .status   = ( responseDB .name === body .status || body .status === null ) ? responseDB .status : body .status;
    //     responseDB .google   = ( responseDB .name === body .google || body .google === null ) ? responseDB .google : body .google;

    //     /** Registra los datos en MongoDB */
    //     responseDB .save( ( err ) => {
    //         if ( err ) {
    //             return response .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
    //                 success: false,
    //                 err
    //             });
    //         }

    //         /** Ejecuta siempre que no exista un error */
    //         response .json({        // Cuando no se coloca el status Node asume implicitamente que fue exitosa la petición y el estado será 200 por defecto
    //             success: true,
    //             user: responseDB
    //         });
    //     });
    // });

    /** Forma 2 */
    User .findByIdAndUpdate( user_id, body, { new: true }, ( error, responseDB ) => {   // findByIdAndUpdate(id, update, options, callback) - { new: true } 'true' devuelve el documento modificado en lugar del original. por defecto es 'false'
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

app .delete( '/usuario/:id', ( request, response ) => {
    response .json({ 
        'message': 'delete /usuario',
        'user_id': request .params .id  
    });
});

module .exports = app;