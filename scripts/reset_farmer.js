require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const resetFarmer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'farmer@agriflow.com';
        const newPassword = 'Farmer@2024';

        let user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} not found. Creating a new farmer.`);
            user = await User.create({
                name: 'OUEDRAOGO',
                email: email,
                password: newPassword,
                role: 'farmer',
                country: 'Burkina Faso',
                status: 'active'
            });
        } else {
            user.password = newPassword;
            await user.save();
            console.log(`Successfully reset password for ${email} to ${newPassword}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

resetFarmer();
