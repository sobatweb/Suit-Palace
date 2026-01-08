const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// SEMUA ROUTE DI-PROTECT
router.get('/', auth, dashboardController.getDashboardData);
router.post('/marks', auth, dashboardController.addMark);
router.post('/notes', auth, dashboardController.addNote);

module.exports = router;
