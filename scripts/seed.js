require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
};

const seedData = async () => {
    await connectDB();

    // Créer un admin par défaut si il n'existe pas déjà
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@agriflow.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@2024';
    const adminCountry = process.env.SEED_ADMIN_COUNTRY || 'Burkina Faso';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
        await User.create({
            name: 'Administrateur AgriFlow',
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            country: adminCountry,
            phone: '+226 25 00 00 00',
            status: 'active',
        });
        console.log(`✅ Admin créé : ${adminEmail}`);
    } else {
        console.log('ℹ️  Admin existe déjà.');
    }

    // Créer un distributeur de test
    const distEmail = process.env.SEED_DIST_EMAIL || 'dist@agriflow.com';
    const distPassword = process.env.SEED_DIST_PASSWORD || 'Dist@2024';
    const distCountry = process.env.SEED_DIST_COUNTRY || 'Burkina Faso';
    const distExists = await User.findOne({ email: distEmail });
    
    if (!distExists) {
        await User.create({
            name: 'Distributeur Test',
            email: distEmail,
            password: distPassword,
            role: 'distributor',
            country: distCountry,
            phone: '+226 25 11 11 11',
            status: 'active',
        });
        console.log(`✅ Distributeur créé : ${distEmail}`);
    } else {
        console.log('ℹ️  Distributeur existe déjà.');
    }

    // Créer des produits de test
    await Product.deleteMany({});
    const admin = await User.findOne({ email: 'admin@agriflow.com' });
    if (admin) {
        await Product.insertMany([
            {
                farmer: admin._id,
                name: 'Engrais NPK 15-15-15',
                description: 'Engrais complet pour cultures mixtes',
                category: 'Fertilizer',
                price: 22500,
                stockQuantity: 5000,
                minThreshold: 500,
                unit: 'kg',
                imageUrl: 'assets/images/fertilizer_npk.png',
            },
            {
                farmer: admin._id,
                name: 'Semences de Maïs EVDT',
                description: 'Variété à haut rendement, résistante à la sécheresse',
                category: 'Seed',
                price: 8000,
                stockQuantity: 1200,
                minThreshold: 200,
                unit: 'kg',
                imageUrl: 'assets/images/maize_seeds.png',
            },
            {
                farmer: admin._id,
                name: 'Insecticide Lambda',
                description: 'Contre les insectes ravageurs sur céréales et légumes',
                category: 'Pesticide',
                price: 15750,
                stockQuantity: 300,
                minThreshold: 50,
                unit: 'litre',
                imageUrl: 'assets/images/insecticide_lambda.png',
            },
        ]);
        console.log('✅ 3 produits créés dans l\'inventaire');
    } else {
        console.log(`ℹ️  ${productsCount} produit(s) déjà présent(s) en base.`);
    }

    console.log('\n🌾 Seed terminé avec succès !');
    console.log('🔗 Backend : http://localhost:5000');
    console.log('📚 Docs API : http://localhost:5000/api-docs\n');
    process.exit(0);
};

seedData().catch((err) => {
    console.error('❌ Erreur lors du seed:', err);
    process.exit(1);
});
