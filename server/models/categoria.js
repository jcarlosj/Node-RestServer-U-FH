const mongoose = require( 'mongoose' );

let Schema = mongoose .Schema,
    categorySchema = new Schema({
        user_id: {
            type: Schema .Types .ObjectId,
            ref: 'Usuario'
        },
        name: {
            type: String,
            unique: true, 
            required: [ true, 'El nombre de la categoría es requerido' ]
        },
        description: {
            type: String
        }  

    });

module .exports = mongoose .model( 'Categoria', categorySchema );
