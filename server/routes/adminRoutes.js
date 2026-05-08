const express = require('express');
const router = express.Router();
const {
  getMyNotifications, markAsRead, markAllRead, getAdminStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Notifications
router.get('/notifications/my',        protect,            getMyNotifications);
router.put('/notifications/:id/read',  protect,            markAsRead);
router.put('/notifications/read-all',  protect, markAllRead);

// Admin stats
router.get('/stats',                   protect, adminOnly, getAdminStats);

module.exports = router;
