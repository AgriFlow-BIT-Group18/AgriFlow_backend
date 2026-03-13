const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please add the product name'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
        },
        stockQuantity: {
            type: Number,
            required: [true, 'Please add stock quantity'],
            default: 0,
        },
        minThreshold: {
            type: Number,
            required: [true, 'Please add a minimum threshold'],
            default: 10,
        },
        unit: {
            type: String,
            required: [true, 'Please add a unit (e.g., kg, bag, litre)'],
            default: 'kg',
        },
        imageUrl: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
