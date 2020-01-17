const mongoose = require( 'mongoose' );

let Schema = mongoose .Schema,
    userSchema = new Schema({
        name: {
            type: String,
            required: [ true, 'El nombre es requerido' ]
        },
        email: {
            type: String,
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

module .exports = mongoose .model( 'Usuario', userSchema );
