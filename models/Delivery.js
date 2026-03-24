const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Order',
        },
        distributor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        driverName: {
            type: String,
            required: true,
        },
        driverPhone: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['assigned', 'in_transit', 'delivered', 'failed'],
            default: 'assigned',
        },
        currentLocation: {
            type: String,
        },
        estimatedDeliveryTime: {
            type: Date,
        },
        deliveredAt: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);

const Delivery = mongoose.model('Delivery', deliverySchema);
module.exports = Delivery;
