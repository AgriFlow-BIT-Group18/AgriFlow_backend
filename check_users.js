require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUsers = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({}, 'name email role');
    console.log('--- USERS IN DATABASE ---');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
};

checkUsers();
