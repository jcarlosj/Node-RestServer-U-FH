const mongoose = require( 'mongoose' ),
      uniqueValidator = require( 'mongoose-unique-validator' );     // Manejador de errores de restricción unica en un Schema de Mongoose

/** Enum 'role' Validation */
let roles = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose .Schema,
    userSchema = new Schema({
        name: {
            type: String,
            required: [ true, 'El nombre es requerido' ]
        },
        email: {
            type: String,
            unique: true,
            required: [ true, 'El correo electrónico es requerido' ]
        },
        password: {
            type: String,
            required: [ true, 'Definir una contraseña es obligatorio' ]
        },
        img: {
            type: String,
            required: false     /** No definir 'required' también lo define como 'false' por defecto */
        },
        role: {
            type: String,
            enum: roles,
            default: 'USER_ROLE'
        },    
        status: {
            type: Boolean,
            default: true
        },  
        google: {
            type: Boolean,
            default: false
        }  

    });

    /** Unique Validations */
    userSchema .plugin( uniqueValidator, {
        message: '{PATH} debe ser único'
    });

    /** Esta funcionalidad se usa siempre se pretende eliminar una propiedad del Modelo con el 
     * propósito de no revelar información delicada (en este caso el String de la encriptación 
     * de la contraseña) cuando el formato de la información requerida en la PETICION es un JSON */
    userSchema .methods .toJSON = function () {     /** Se recomienda no usar Arrow Functions */
        let user = this,
            userObj = user .toObject();

        delete userObj .password;    

        return userObj;
    } 

module .exports = mongoose .model( 'Usuario', userSchema );
