const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

const getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find({}).populate('order');
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyDeliveries = async (req, res) => {
    try {
        // Find orders belonging to the user
        const orders = await Order.find({ user: req.user._id });
        const orderIds = orders.map(o => o._id);
        
        // Find deliveries linked to those orders
        const deliveries = await Delivery.find({ order: { $in: orderIds } }).populate('order');
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createDelivery = async (req, res) => {
    const { orderId, order: bodyOrder, driverName, driverPhone, estimatedDeliveryTime } = req.body;
    const finalOrderId = orderId || bodyOrder;

    try {
        if (!finalOrderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        const order = await Order.findById(finalOrderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const delivery = await Delivery.create({
            order: finalOrderId,
            driverName,
            driverPhone,
            estimatedDeliveryTime,
            status: 'assigned'
        });

        // Update the associated order status to 'delivery'
        order.status = 'delivery';
        await order.save();

        // Create notification for order owner
        await Notification.create({
            user: order.user,
            title: 'Delivery Scheduled',
            message: `A delivery has been scheduled for your order #${order._id.toString().substring(16)}. Driver: ${driverName}.`,
            type: 'delivery'
        });

        res.status(201).json(delivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDeliveryStatus = async (req, res) => {
    const { status, currentLocation } = req.body;
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (delivery) {
            delivery.status = status || delivery.status;
            delivery.currentLocation = currentLocation || delivery.currentLocation;
            if (status === 'delivered') {
                delivery.deliveredAt = Date.now();
                
                // Also update the associated order status to 'delivered'
                const order = await Order.findById(delivery.order);
                if (order) {
                    order.status = 'delivered';
                    await order.save();

                    // Create notification for order owner
                    await Notification.create({
                        user: order.user,
                        title: 'Package Delivered',
                        message: `Your order #${order._id.toString().substring(16)} has been delivered!`,
                        type: 'delivery'
                    });
                }
            }
            const updatedDelivery = await delivery.save();
            res.status(200).json(updatedDelivery);
        } else {
            res.status(404).json({ message: 'Delivery not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDeliveries,
    getMyDeliveries,
    createDelivery,
    updateDeliveryStatus,
};
