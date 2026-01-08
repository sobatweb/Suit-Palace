const DashboardModel = require('../models/DashboardModel');

exports.getDashboardData = async (req, res) => {
    try {
        const history = await DashboardModel.getHistoryView();
        const customerOrders = await DashboardModel.getCustomerOrders();
        const stock = await DashboardModel.getProductStock();
        const stats = await DashboardModel.getSummaryStats();
        const marks = await DashboardModel.getMarks();
        const notes = await DashboardModel.getNotes();

        res.json({
            history,
            customerOrders,
            stock,
            stats,
            marks,
            notes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMark = async (req, res) => {
    try {
        const id = await DashboardModel.addMark(req.body);
        res.status(201).json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.addNote = async (req, res) => {
    try {
        const id = await DashboardModel.addNote(req.body);
        res.status(201).json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteMark = async (req, res) => {
    try {
        await DashboardModel.deleteMark(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteNote = async (req, res) => {
    try {
        await DashboardModel.deleteNote(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
