require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const crypto = require('crypto');

const simulateForgotPassword = async (email) => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
        console.log('User not found');
        process.exit(1);
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    console.log('Generated Reset Token:', resetToken);

    // Now try to reset it using the controller logic
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const userToReset = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (userToReset) {
        console.log('User found for reset token:', userToReset.email);
        userToReset.password = 'NewPassword@2024';
        userToReset.resetPasswordToken = undefined;
        userToReset.resetPasswordExpire = undefined;
        await userToReset.save();
        console.log('Password successfully reset in simulation');
    } else {
        console.log('Failed to find user with hashed token');
    }

    process.exit(0);
};

simulateForgotPassword('admin@agriflow.com');
