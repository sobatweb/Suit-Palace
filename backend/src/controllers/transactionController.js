const TransactionModel = require('../models/TransactionModel');

exports.createOrder = async (req, res) => {
    try {
        // req.body should contain { orderData, bookingData }
        const { orderData, bookingData } = req.body;
        const orderId = await TransactionModel.createOrder(orderData, bookingData);
        res.status(201).json({ message: 'Order created', orderId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await TransactionModel.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        await TransactionModel.updateOrder(req.params.id, req.body);
        res.json({ message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.finishOrder = async (req, res) => {
    try {
        await TransactionModel.finishOrder(req.params.id, req.body);
        res.json({ message: 'Order finished' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteOrder = async (req, res) => {
    try {
        await TransactionModel.deleteOrder(req.params.id);
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
