const db = require('../config/db');

class CustomerModel {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM customers');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM customers WHERE id_customer = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { customer_name, customer_phone, bank_account, discount, penalty_fee } = data;
        const [result] = await db.query(
            'INSERT INTO customers (customer_name, customer_phone, bank_account, discount, penalty_fee) VALUES (?, ?, ?, ?, ?)',
            [customer_name, customer_phone, bank_account, discount || 0, penalty_fee || 0]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { customer_name, customer_phone, bank_account, discount, penalty_fee } = data;
        const [result] = await db.query(
            'UPDATE customers SET customer_name = ?, customer_phone = ?, bank_account = ?, discount = ?, penalty_fee = ? WHERE id_customer = ?',
            [customer_name, customer_phone, bank_account, discount || 0, penalty_fee || 0, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM customers WHERE id_customer = ?', [id]);
        return result.affectedRows;
    }

    static async merge(oldId, newId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Update order_items yang pakai ID lama biar pake ID baru
            await connection.query(
                'UPDATE order_items SET id_customer = ? WHERE id_customer = ?',
                [newId, oldId]
            );

            // 3. Hapus customer lama
            await connection.query('DELETE FROM customers WHERE id_customer = ?', [oldId]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = CustomerModel;
