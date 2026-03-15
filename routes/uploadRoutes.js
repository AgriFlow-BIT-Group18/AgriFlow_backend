const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middlewares/authMiddleware');
const User = require('../models/User');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = req.params.type || 'others';
        let folder = 'uploads/';
        if (type === 'avatar') folder += 'avatars';
        else if (type === 'ai') folder += 'ai-attachments';
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images, PDFs, and Word documents are allowed'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
});

// @desc    Upload avatar
// @route   POST /api/upload/avatar
// @access  Private
router.post('/avatar', protect, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    try {
        const user = await User.findById(req.user._id);
        const filePath = `/uploads/avatars/${req.file.filename}`;
        user.avatar = filePath;
        await user.save();

        res.status(200).json({
            message: 'Avatar uploaded successfully',
            avatar: filePath
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Upload AI attachment
// @route   POST /api/upload/ai
// @access  Private
router.post('/ai', protect, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    const filePath = `/uploads/ai-attachments/${req.file.filename}`;
    res.status(200).json({
        message: 'File uploaded successfully',
        url: filePath,
        name: req.file.originalname,
        type: req.file.mimetype.startsWith('image/') ? 'image' : 'file'
    });
});

module.exports = router;
