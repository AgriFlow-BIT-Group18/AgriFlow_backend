const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

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
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
