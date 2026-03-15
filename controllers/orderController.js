const Order = require('../models/Order');
const Notification = require('../models/Notification');

const createOrder = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        try {
            const order = new Order({
                user: req.user._id,
                orderItems,
                shippingAddress,
                paymentMethod,
                totalPrice,
            });

            const createdOrder = await order.save();
            
            // Create notification for user
            await Notification.create({
                user: req.user._id,
                title: 'Order Placed',
                message: `Your order #${createdOrder._id.toString().substring(16)} has been placed successfully.`,
                type: 'order'
            });

            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name region');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();

            // Create notification for user
            await Notification.create({
                user: order.user,
                title: 'Order Status Updated',
                message: `Your order status has been updated to: ${updatedOrder.status}.`,
                type: 'order'
            });

            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus,
};
