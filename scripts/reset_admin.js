require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@agriflow.com';
        const newPassword = 'Admin@2024';

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} not found.`);
            process.exit(1);
        }

        user.password = newPassword;
        await user.save();

        console.log(`Successfully reset password for ${email} to ${newPassword}`);
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error.message);
        process.exit(1);
    }
};

resetAdminPassword();
