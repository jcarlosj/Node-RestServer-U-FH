const mongoose = require( 'mongoose' );

let Schema = mongoose .Schema,
    categorySchema = new Schema({
        user: {
            type: Schema .Types .ObjectId,
            ref: 'Usuario'
        },
        name: {
            type: String,
            unique: true, 
            required: [ true, 'El nombre de la categoría es requerido' ]
        },
        description: {
            type: String,
            required: [ true, 'La descripción de la categoría es requerida' ]
        }  

    });

module .exports = mongoose .model( 'Categoria', userSchema );
