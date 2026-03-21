require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkLogin = async (email, password) => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
        console.log('User not found');
        process.exit(1);
    }

    const isMatch = await user.matchPassword(password);
    console.log(`Login check for ${email} with password "${password}": ${isMatch ? 'SUCCESS' : 'FAILURE'}`);
    
    // Check role as well
    console.log(`User role in DB: ${user.role}`);

    process.exit(0);
};

checkLogin('admin@agriflow.com', 'Admin@2024');
