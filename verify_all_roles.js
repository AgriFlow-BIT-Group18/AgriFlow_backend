require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const verifyRole = async (email, password, expectedRole) => {
    const user = await User.findOne({ email });
    if (!user) {
        console.log(`❌ User NOT FOUND: ${email}`);
        return false;
    }

    const isMatch = await user.matchPassword(password);
    const roleMatch = user.role === expectedRole;
    
    if (isMatch && roleMatch) {
        console.log(`✅ SUCCESS: ${email} logged in as ${user.role} with password "${password}"`);
        return true;
    } else {
        console.log(`❌ FAILURE for ${email}: Password Match: ${isMatch}, Role Match: ${roleMatch} (Got: ${user.role}, Expected: ${expectedRole})`);
        return false;
    }
};

const runVerification = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Verifying Roles & Credentials ---');
        
        const checks = [
            { email: 'admin@agriflow.com', password: 'Admin@2024', role: 'admin', label: 'Admin' },
            { email: 'farmer@agriflow.com', password: 'Farmer@2024', role: 'farmer', label: 'Aggregator (Farmer)' },
            { email: 'dist@agriflow.com', password: 'Dist@2024', role: 'distributor', label: 'Distributor' }
        ];

        let allPassed = true;
        for (const check of checks) {
            console.log(`Checking ${check.label}...`);
            const passed = await verifyRole(check.email, check.password, check.role);
            if (!passed) allPassed = false;
        }

        if (allPassed) {
            console.log('\n🌟 ALL SYSTEMS OPERATIONAL 🌟');
        } else {
            console.log('\n⚠️ SOME CHECKS FAILED ⚠️');
        }

        process.exit(allPassed ? 0 : 1);
    } catch (error) {
        console.error('Error during verification:', error);
        process.exit(1);
    }
};

runVerification();
