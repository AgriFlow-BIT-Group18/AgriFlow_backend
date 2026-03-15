const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, getUnreadCount } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getNotifications);
router.route('/unread-count').get(protect, getUnreadCount);
router.route('/:id/read').put(protect, markAsRead);

module.exports = router;
