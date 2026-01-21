const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Routes include table param
router.get('/:table', inventoryController.getAllItems);
router.post('/:table', inventoryController.createItem);
router.put('/:table/:id/stock', inventoryController.updateStock);
router.put('/:table/:id', inventoryController.updateItem);
router.delete('/:table/:id', inventoryController.deleteItem);

module.exports = router;
