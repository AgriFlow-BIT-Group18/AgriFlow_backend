require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

const checkOrders = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const userId = '69b4582927f0943319cc420f';
    const orders = await Order.find({ user: userId });
    
    console.log('--- ORDER LIST FOR Ali OUEDRAOGO ---');
    orders.forEach((o, i) => console.log(`${i+1}. status: ${o.status}, createdAt: ${o.createdAt}`));
    
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'approved').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    
    console.log('\nCalculated Stats:');
    console.log('Pending/Approved:', pending);
    console.log('Delivered:', delivered);
    process.exit(0);
};

checkOrders().catch(err => {
    console.error(err);
    process.exit(1);
});
