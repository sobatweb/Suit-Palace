const db = require('../config/db');

class InventoryModel {
    // Helper to validate allowed tables to prevent SQL injection
    static validateTable(table) {
        const allowed = ['jas', 'kemeja', 'celana', 'changshan', 'dasi', 'packages', 'booked', 'vest', 'tuxedo', 'notes', 'marks'];
        if (!allowed.includes(table)) {
            throw new Error('Invalid table name');
        }
        return table;
    }

    static async getAll(table) {
        const tableName = this.validateTable(table);
        const [rows] = await db.query(`SELECT * FROM ${tableName}`);
        return rows;
    }

    static async executeQuery(query, params) {
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async getById(table, idField, id) {
        const tableName = this.validateTable(table);
        // Fix: Jika tabel notes, pastikan menggunakan id_note meskipun controller mengirim id_notes
        let actualIdField = idField;
        if (table === 'notes' && idField === 'id_notes') actualIdField = 'id_note';

        const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE ${actualIdField} = ?`, [id]);
        return rows[0];
    }

    // Generic create for products
    // Note: Fields vary by table, so we blindly insert key-values provided in data
    // Caller must ensure data keys match column names
    static async create(table, data) {
        const tableName = this.validateTable(table);
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');

        const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
        const [result] = await db.query(query, values);
        return result.insertId;
    }

    static async update(table, idField, id, data) {
        const tableName = this.validateTable(table);
        // Fix: Jika tabel notes, pastikan menggunakan id_note meskipun controller mengirim id_notes
        let actualIdField = idField;
        if (table === 'notes' && idField === 'id_notes') actualIdField = 'id_note';

        const keys = Object.keys(data);
        const values = Object.values(data);

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const query = `UPDATE ${tableName} SET ${setClause} WHERE ${actualIdField} = ?`;

        const [result] = await db.query(query, [...values, id]);
        return result.affectedRows;
    }

    static async delete(table, idField, id) {
        const tableName = this.validateTable(table);
        // Fix: Jika tabel notes, pastikan menggunakan id_note meskipun controller mengirim id_notes
        let actualIdField = idField;
        if (table === 'notes' && idField === 'id_notes') actualIdField = 'id_note';

        const query = `DELETE FROM ${tableName} WHERE ${actualIdField} = ?`;
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = InventoryModel;
