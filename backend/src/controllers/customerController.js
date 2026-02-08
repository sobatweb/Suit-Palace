const CustomerModel = require('../models/CustomerModel');

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await CustomerModel.getAll();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const id = await CustomerModel.create(req.body);
        res.status(201).json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        await CustomerModel.update(req.params.id, req.body);
        res.json({ message: 'Customer updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        await CustomerModel.delete(req.params.id);
        res.json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.mergeCustomers = async (req, res) => {
    try {
        const { oldId, newId } = req.body;
        if (!oldId || !newId) {
            return res.status(400).json({ message: 'oldId and newId are required' });
        }
        await CustomerModel.merge(oldId, newId);
        res.json({ message: 'Customers merged and old record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
