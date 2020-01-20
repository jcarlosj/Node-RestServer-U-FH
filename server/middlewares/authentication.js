const jwt = require( 'jsonwebtoken' );           // JSON Web Token

/** Verifica TOKEN */
let validateToken = ( request, response, next ) => {
    let token = request .get( 'authorization' );    // Obtiene el valor del key 'authorization' en el Header del Request (o petición)

    console .info( 'Middleware > TOKEN:', token );
    
    /** Match TOKEN: Verificación del Token */
    jwt .verify( token, process .env .SEED, ( error, decoded ) => {
        if( error ) {
            return response .status( 401 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        console .info( 'Middleware > PayLoad', decoded );

        /** Solo se ejecuta si la información es correcta */
        request .user = decoded .user;  // Envio el Payload del JWT
        next();     // Le da continuación a la ejecución del código donde implementemos el Middleware 'validateToken'
    });
    
}

module .exports = {
    validateToken       // Nombre del Middleware
}