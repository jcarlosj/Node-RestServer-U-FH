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

    /** Elimina propiedades del objeto 'body' para evitar que se puedan actualizar estos campos */
    delete body .password;      // Si no se eliminara se podría actualizar (sin encripción)
    delete body .google;        // Si no se eliminara se podría actualizar

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

app .delete( '/usuario/:id', ( request, response ) => {
    response .json({ 
        'message': 'delete /usuario',
        'user_id': request .params .id  
    });
});

module .exports = app;