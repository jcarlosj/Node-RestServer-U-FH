const mongoose = require( 'mongoose' ),
      uniqueValidator = require( 'mongoose-unique-validator' );     // Manejador de errores de restricción unica en un Schema de Mongoose

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

    userSchema .plugin( uniqueValidator, {
        message: '{PATH} debe ser único'
    });

module .exports = mongoose .model( 'Usuario', userSchema );
