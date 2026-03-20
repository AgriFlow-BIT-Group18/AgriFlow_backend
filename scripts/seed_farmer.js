require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedFarmer = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const farmerEmail = 'farmer@agriflow.com';
    const farmerExists = await User.findOne({ email: farmerEmail });
    if (!farmerExists) {
        await User.create({
            name: 'Kofi Mensah',
            email: farmerEmail,
            password: 'Farmer@2024',
            role: 'farmer',
            country: 'Burkina Faso',
            phone: '+233 24 000 0001',
            status: 'active'
        });
        console.log('✅ Farmer créé : farmer@agriflow.com / Farmer@2024');
    } else {
        console.log('ℹ️  Farmer existe déjà.');
    }
    process.exit(0);
};

seedFarmer();
