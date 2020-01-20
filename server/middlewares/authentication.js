/** Verifica TOKEN */
let validateToken = ( request, response, next ) => {
    let token = request .get( 'authorization' );    // Obtiene el valor del key 'authorization' en el Header del Request (o petición)

    console .log( 'Middleware > TOKEN:', token );
    
    response .json({
        success: true,
        token
    })
}

module .exports = {
    validateToken
}