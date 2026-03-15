const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['order', 'delivery', 'system'],
            default: 'system',
        },
        isRead: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
