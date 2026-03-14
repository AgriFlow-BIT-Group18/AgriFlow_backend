require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const checkPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email: 'admin@agriflow.com' });
        if (!user) {
            console.log('User NOT found');
            process.exit(1);
        }
        const isMatch = await bcrypt.compare('Admin@2024', user.password);
        console.log(`Password match for admin@agriflow.com: ${isMatch}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkPassword();
