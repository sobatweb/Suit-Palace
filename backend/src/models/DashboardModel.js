const db = require('../config/db');

class DashboardModel {
    static async getHistoryView() {
        const [rows] = await db.query('SELECT * FROM history_orders ORDER BY id_history DESC');
        return rows;
    }

    static async getCustomerOrders() {
        const [rows] = await db.query('SELECT * FROM customer_order ORDER BY id_order DESC');
        return rows;
    }

    static async getProductStock() {
        // View 'product_stock' unions all tables
        const [rows] = await db.query('SELECT * FROM product_stock');
        return rows;
    }

    static async getSummaryStats() {
        const [activeOrders] = await db.query("SELECT COUNT(*) as count FROM order_items WHERE status_order = 'Belum Selesai'");
        const [totalRevenue] = await db.query("SELECT SUM(omset_order) as total FROM history_orders");
        const [customers] = await db.query("SELECT COUNT(*) as count FROM customers");

        return {
            activeOrders: activeOrders[0].count,
            totalRevenue: totalRevenue[0].total || 0,
            totalCustomers: customers[0].count
        };
    }

    // For marks and notes (Calendar)
    static async getMarks() {
        // Kirim date_mark sebagai 'date' dengan format YYYY-MM-DD agar cocok dengan filter frontend
        const [rows] = await db.query('SELECT id_marks, color_mark, note_mark, DATE(date_mark) as date FROM marks');
        return rows;
    }

    static async getNotes() {
        const [rows] = await db.query('SELECT * FROM notes');
        return rows;
    }

    static async addMark(data) {
        const [res] = await db.query('INSERT INTO marks (color_mark, note_mark, date_mark) VALUES (?, ?, ?)',
            [data.color_mark, data.note_mark, data.date_mark]);
        return res.insertId;
    }

    static async addNote(data) {
        const [res] = await db.query('INSERT INTO notes (title_note, description_note) VALUES (?, ?)',
            [data.title_note, data.description_note]);
        return res.insertId;
    }

    static async deleteMark(id) {
        const [res] = await db.query('DELETE FROM marks WHERE id_marks = ?', [id]);
        return res;
    }

    static async deleteNote(id) {
        const [res] = await db.query('DELETE FROM notes WHERE id_note = ?', [id]);
        return res;
    }
}

module.exports = DashboardModel;
