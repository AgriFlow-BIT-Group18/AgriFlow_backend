require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const debugUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@agriflow.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} not found.`);
        } else {
            console.log('User found:');
            console.log('- Email:', user.email);
            console.log('- Role:', user.role);
            console.log('- Status:', user.status);
            console.log('- Password Hashed:', user.password.substring(0, 10) + '...');
            
            // Test password match
            const testPassword = 'Admin@2024';
            const isMatch = await user.matchPassword(testPassword);
            console.log(`- Password "${testPassword}" match:`, isMatch);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error debugging user:', error.message);
        process.exit(1);
    }
};

debugUser();
