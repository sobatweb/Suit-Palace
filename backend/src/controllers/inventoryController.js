const InventoryModel = require('../models/InventoryModel');

exports.getAllItems = async (req, res) => {
    try {
        const { table } = req.params;
        const items = await InventoryModel.getAll(table);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createItem = async (req, res) => {
    try {
        const { table } = req.params;
        const id = await InventoryModel.create(table, req.body);
        res.status(201).json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { table, id } = req.params;
        // Determine ID field name based on table (convention: id_<table_singular>)
        // OR we can pass it from frontend.
        // Let's assume the frontend passes the object which works for body, but for WHERE clause we need field name.
        // Convention from SQL: jas -> id_jas, kemeja -> id_kemeja, packages -> id_package
        const idField = `id_${table.replace(/s$/, '')}`; // basic heuristics (package -> id_package)
        // Adjust for 'packages' -> 'id_package', 'jas' -> 'id_jas' (no plural change for jas)
        // A better way is to check the table name.
        let actualIdField = `id_${table}`;
        if (table === 'packages') actualIdField = 'id_package';
        if (table === 'admins') actualIdField = 'id_admin';
        if (table === 'customers') actualIdField = 'id_customer';

        // For jas, kemeja etc they are singular in table name usually in this DB?
        // SQL: TABLE jas (id_jas...), TABLE kemeja (id_kemeja...) - singular names.
        // So `id_${table}` works for jas, kemeja.

        await InventoryModel.update(table, actualIdField, id, req.body);
        res.json({ message: 'Item updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { table, id } = req.params;
        let actualIdField = `id_${table}`;
        if (table === 'packages') actualIdField = 'id_package';

        await InventoryModel.delete(table, actualIdField, id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
