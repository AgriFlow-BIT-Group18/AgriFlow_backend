const express = require('express');
const router = express.Router();
const {
    getDeliveries,
    createDelivery,
    updateDeliveryStatus,
} = require('../controllers/deliveryController');
const { protect } = require('../middlewares/authMiddleware');
const { admin, staff } = require('../middlewares/roleMiddleware');

router.route('/')
    .get(protect, staff, getDeliveries)
    .post(protect, admin, createDelivery);

router.route('/:id/status')
    .put(protect, updateDeliveryStatus);

module.exports = router;
