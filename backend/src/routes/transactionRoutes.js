const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/orders', transactionController.getAllOrders);
router.post('/orders', transactionController.createOrder); // Payload: { orderData, bookingData }
router.put('/orders/:id', transactionController.updateOrder);
router.post('/orders/:id/finish', transactionController.finishOrder);
router.delete('/orders/:id', transactionController.deleteOrder);

module.exports = router;
