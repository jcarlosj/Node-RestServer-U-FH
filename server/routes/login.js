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

/** Valida el TOKEN de Google 
 * Using a Google API Client Library - Usar una biblioteca de cliente API de Google */
async function verify( token ) {       // Regresa una Promesa por que es una función Asíncrona
    
    const ticket = await client .verifyIdToken({
        idToken: token,
        audience: process .env .CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket .getPayload();
    const userid = payload[ 'sub' ];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    console .group( 'Datos registrados en Google' );
    console .log( 'Name >', payload .name );
    console .log( 'Email >', payload .email );
    console .log( 'Picture >', payload .picture );
    console .groupEnd();

    return {
        name: payload .name,
        email: payload .email,
        img: payload .picture,
        google: true
    }
} 

/** Registra / Autentica usuarios usando Google Sign-In (Credenciales de Google) */
app .post( '/google', async ( request, response ) => {
    let googleToken = request .body .idtoken,      // Recibe Token de Google
        googleUser = await verify( googleToken ) .catch( error => {
            return response .status( 403 ) .json({
                success: false,
                error       
            });
        });       

    /** Valida que usuario de Google no se encuentre registrado */
    User .findOne({ email: googleUser .email }, ( error, usuarioDB ) => {
        if( error ) {
            return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Valida si el usuario se encuentra registrado en la BD */
        if( usuarioDB ) {

            /** Valida si el usuario NO se ha autenticado por Google */
            if( ! usuarioDB .google ) {
                if( error ) {
                    return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                        success: false,
                        error: {
                            message: 'Debe autenticarse de manera tradicional'
                        }
                    });
                }
            }
            else {
                /** Renueva el TOKEN: JWT H256: Solo si el usuario ya se ha autenticado previamente con su cuenta de Google */
                let token = jwt .sign({
                        user: usuarioDB,
                    }, 
                        process .env .SEED,        // Key or Seed: Semilla de validación (No olvidar configurar variable de entorno en producción).
                    {
                        expiresIn: process .env .TOKEN_EXPIRATION_DATE  
                        /** seconds minutes hours days */
                    }
                );

                response .json({
                    success: true,
                    token,
                    user: usuarioDB
                });

            }
        }
        else {
            /** El usuario NO existe en la BD */
            let user = new User();      // Creamos una instancia del Modelo Usuario (Mongoose)

            /** Asignamos los valores que vamos a registrar */
            user .name = googleUser .name;
            user .email = googleUser .email;
            user .img = googleUser .img;
            user .google = true;
            user .password = 'este-password-no-se-usa';  // La propiedad esta definida como obligatoria en el Modelo Usuario (Mongoose)
                                                // Sin embargo este valor no será usado para autenticarse vía Google Sign-In.

            /** Registra al usuario con las credenciales de Google Sign-In en nuestra BD */                                                
            user .save( ( error, usuarioDB ) => {
                if( error ) {
                    return response .status( 500 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                        success: false,
                        error
                    });
                }

                /** Si no existe ERROR:
                 *  - Registra el nuevo Usuario
                 *  - Crea el Token y
                 *  - Retorna los datos 
                 */
                let token = jwt .sign({
                        user: usuarioDB,
                    }, 
                        process .env .SEED,        // Key or Seed: Semilla de validación (No olvidar configurar variable de entorno en producción).
                    {
                        expiresIn: process .env .TOKEN_EXPIRATION_DATE  
                        /** seconds minutes hours days */
                    }
                );

                return response .json({
                    success: true,
                    token,
                    user: usuarioDB
                });

            });
        }

    });

});

module .exports = app;