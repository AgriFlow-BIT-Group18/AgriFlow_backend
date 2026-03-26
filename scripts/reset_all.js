require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const resetAll = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const usersToReset = [
            { email: 'admin@agriflow.com', password: 'Admin@2024', role: 'admin' },
            { email: 'dist@agriflow.com', password: 'Dist@2024', role: 'distributor' },
            { email: 'farmer@agriflow.com', password: 'Farmer@2024', role: 'farmer' }
        ];

        for (const u of usersToReset) {
            const user = await User.findOne({ email: u.email });
            if (user) {
                user.password = u.password;
                await user.save();
                console.log(`✅ ${u.role} (${u.email}) reset to: ${u.password}`);
            } else {
                console.log(`❌ ${u.role} (${u.email}) not found`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Error resetting passwords:', err);
        process.exit(1);
    }
};

resetAll();
