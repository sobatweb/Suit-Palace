const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.getDashboardData);
router.post('/marks', dashboardController.addMark);
router.post('/notes', dashboardController.addNote);

module.exports = router;
