const express = require( 'express' ),
      app = express(),
      /** Modelos Requeridos */
      Category = require( '../models/categoria' );    // Importa el modelo de Usuario

/** Muestra todas las categorías */
app .get( '/categoria', ( request, response ) => {

    Category .find({}, 'name description' )   // Filtra campos que se desean obtener (mostrar)
        .exec( ( error, categorias ) => {

            if( error ) {
                return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                    success: false,
                    error
                });
            }
            
            /** Ejecuta siempre que no exista un error */
            response .json({
                success: true,
                count: categorias .length,
                categorias
            });
          
        });
    
});

/** Muestra una categoría por ID */
app .get( '/categoria/:id', ( request, response ) => {
    let id = request .params .id;

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
            category: categoryDB
        });

    });
    
});

/** Crea categoría */
app .post( '/categoria', ( request, response ) => {
    const { name, description } = request .body;        // Obtenemos los datos enviados de la petición (usando el concepto de Destructuración)

    let category = new Category({ 
        //user, 
        name, 
        description
    });

    /** Registra los datos en MongoDB */
    category .save( ( error, categoryDB ) => {
        if( error ) {
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({
            success: true,
            category: categoryDB
        });

    });

});

/** Actualizar categoría */
app .put( '/categoria/:id', ( request, response ) => {
    let category_id = request .params .id,  // Obtenemos los parámetros enviados (GET)
        body = request .body;               // Obtenermos los valores enviados (POST)

    Category .findByIdAndUpdate( category_id, body, ( error, categoryDB ) => {   // findByIdAndUpdate(id, update, options, callback) - { new: true } 'true' devuelve el documento modificado en lugar del original. por defecto es 'false'
        if( error ) {
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
                success: false,
                error
            });
        }

        /** Ejecuta siempre que no exista un error */
        response .json({        // Cuando no se coloca el status Node asume implicitamente que fue exitosa la petición y el estado será 200 por defecto
            success: true,
            user: categoryDB
        });
    });
});

/** Elimina Categoría 
 * Solo un Administrador puede borrar una categoría
*/
app .delete( '/categoria/:id', ( request, response ) => {
    let category_id = request .params .id;      // Obtiene el id del usuario enviado como parámetro por la URL (GET)

    Category .findByIdAndRemove( category_id, ( error, categoryDB ) => {
        if( error ) {
            return response .status( 400 ) .json({  /** NOTA: usar el return hace que salga (Finalice el registro de datos) y evita que deba rescribir un else */
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
            user: categoryDB
        });

    });

});

module .exports = app;