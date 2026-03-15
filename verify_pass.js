require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const checkPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@agriflow.com';
        const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@2024';
        const user = await User.findOne({ email: adminEmail });
        if (!user) {
            console.log(`User ${adminEmail} NOT found`);
            process.exit(1);
        }
        const isMatch = await bcrypt.compare(adminPassword, user.password);
        console.log(`Password match for ${adminEmail}: ${isMatch}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkPassword();
