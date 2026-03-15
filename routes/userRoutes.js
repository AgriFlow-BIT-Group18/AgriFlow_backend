const express = require('express');
const router = express.Router();
const {
    getUsers,
    updateUserStatus,
    deleteUser,
    updateUser,
    getNearbyDistributors,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { admin, staff } = require('../middlewares/roleMiddleware');

router.get('/nearby-distributors', protect, getNearbyDistributors);
router.route('/').get(protect, staff, getUsers);
router.route('/:id')
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser);
router.route('/:id/status').put(protect, admin, updateUserStatus);

module.exports = router;
