const express = require( 'express' ),
      app = express(),
      /** Dependencias */
      bcrypt = require( 'bcryptjs' ),             // Encriptar contraseñas
      jwt = require( 'jsonwebtoken' ),           // JSON Web Token
      /** Modelos Requeridos */
      User = require( '../models/usuario' );    // Importa el modelo de Usuario

app .post( '/login', ( request, response ) => {
    let { email, password } = request .body;

    User .findOne({
        email
    }, ( error , usuarioDB ) => {
        if( error ) {
            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Valida que el Usuario no Existe en la BD */
        if( ! usuarioDB ) {
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error: {
                    message: '(Usuario) o Contraseña incorrectos!'
                }
            });
        }

        /** Valida que la contraseña no haga Match */
        if( ! bcrypt.compareSync( password, usuarioDB .password ) ) {
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error: {
                    message: 'Usuario o (Contraseña) incorrectos!'
                }
            });
        }

        /** Generar JWT H256 */
        let token = jwt .sign({
                user: usuarioDB,
            }, 
            process .env .SEED,        // Key or Seed: Semilla de validación (No olvidar configurar variable de entorno en producción).
            {
                expiresIn: process .env .TOKEN_EXPIRATION_DATE  
                /** seconds minutes hours days */
            }
        );

        /** Ejecuta siempre que no exista un error */
        response .json({        // Cuando no se coloca el status Node asume implicitamente que fue exitosa la petición y el estado será 200 por defecto
            success: true,
            token,
            user: usuarioDB
        });

    });

});

/** URI que Obtendrá el Token de Google */
app .post( '/google', ( request, response ) => {
    let googleToken = request .body .idtoken;      // Recibe Token de Google

    response .json({
        success: true,
        googleToken
    });
});

module .exports = app;