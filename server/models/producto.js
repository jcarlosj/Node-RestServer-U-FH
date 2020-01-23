const mongoose = require( 'mongoose' );

let Schema = mongoose .Schema,
    productSchema = new Schema({
        name: {
            type: String,
            required: [ true, 'El nombre del producto es requerido' ]
        },
        description: {
            type: String
        },
        unitPrice: {
            type: Number,
            required: [ true, 'El precio únitario del producto es requerido' ]
        },
        available: {
            type: Boolean,
            required: true,
            default: true
        },
        category: {
            type: Schema .Types .ObjectId,
            ref: 'Categoria'
        },
        user: {
            type: Schema .Types .ObjectId,
            ref: 'Usuario'
        },  

    });

module .exports = mongoose .model( 'Producto', productSchema );
