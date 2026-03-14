const express = require('express');
const router = express.Router();
const { getDashboardStats, exportData } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');
const { admin, staff } = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get dashboard analytics data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */
router.get('/', protect, staff, getDashboardStats);

/**
 * @swagger
 * /api/analytics/export:
 *   get:
 *     summary: Export distribution data as CSV
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 */
router.get('/export', protect, staff, exportData);

module.exports = router;
