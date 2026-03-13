require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    console.log(users.map(u => ({ email: u.email, role: u.role, name: u.name })));
    mongoose.disconnect();
});
