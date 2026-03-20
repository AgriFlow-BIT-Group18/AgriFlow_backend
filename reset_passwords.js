require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const resetPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Reset Admin
        const adminEmail = 'admin@agriflow.com';
        const adminPassword = 'Admin@2024';
        const admin = await User.findOne({ email: adminEmail });
        
        if (admin) {
            admin.password = adminPassword;
            await admin.save();
            console.log(`✅ Admin (${adminEmail}) password reset to: ${adminPassword}`);
        } else {
            console.log(`❌ Admin (${adminEmail}) not found`);
        }

        // Reset Distributor
        const distEmail = 'dist@agriflow.com';
        const distPassword = 'Dist@2024';
        const dist = await User.findOne({ email: distEmail });
        
        if (dist) {
            dist.password = distPassword;
            await dist.save();
            console.log(`✅ Distributor (${distEmail}) password reset to: ${distPassword}`);
        } else {
            console.log(`❌ Distributor (${distEmail}) not found`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error resetting passwords:', err);
        process.exit(1);
    }
};

resetPasswords();
