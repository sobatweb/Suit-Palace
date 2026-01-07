const db = require('../config/db');

class TransactionModel {
    static async createOrder(orderData, bookingData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insert into booked
            const { id_jas, id_kemeja, id_celana, id_changshan, id_dasi } = bookingData;
            const [bookedResult] = await connection.query(
                'INSERT INTO booked (id_jas, id_kemeja, id_celana, id_changshan, id_dasi) VALUES (?, ?, ?, ?, ?)',
                [id_jas || null, id_kemeja || null, id_celana || null, id_changshan || null, id_dasi || null]
            );
            const id_booked = bookedResult.insertId;

            // 2. Insert into order_items
            const {
                id_customer, id_package, start_dates, end_dates,
                total_price, amount_paid, description_rent
            } = orderData;

            const [orderResult] = await connection.query(
                `INSERT INTO order_items 
                (id_customer, id_package, id_booked, start_dates, end_dates, total_price, amount_paid, description_rent, status_rent, status_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Booked', 'Belum Selesai')`,
                [id_customer, id_package, id_booked, start_dates, end_dates, total_price, amount_paid || 0, description_rent || '']
            );

            await connection.commit();
            return orderResult.insertId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAllOrders() {
        const [rows] = await db.query('SELECT * FROM order_items JOIN booked ON order_items.id_booked = booked.id_booked ORDER BY id_order DESC');
        return rows;
    }

    static async getOrderById(id) {
        const [rows] = await db.query('SELECT * FROM order_items WHERE id_order = ?', [id]);
        return rows[0];
    }

    static async updateOrder(id, data) {
        // Dynamic update
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        const [result] = await db.query(`UPDATE order_items SET ${setClause} WHERE id_order = ?`, [...values, id]);
        return result.affectedRows;
    }

    // Special method for "Finish Order" which might involve penalties and status changes
    // Triggers in SQL handle history insertion and stock return if status changes appropriately
    static async finishOrder(id, penalty_paid, description_rent) {
        // Set to Returned and Finished
        const [result] = await db.query(
            `UPDATE order_items 
             SET status_rent = 'Dikembalikan', 
                 status_order = 'Sudah Selesai', 
                 actual_return_date = NOW(),
                 penalty_paid = ?,
                 description_rent = ?
             WHERE id_order = ?`,
            [penalty_paid, description_rent, id]
        );
        return result.affectedRows;
    }
}

module.exports = TransactionModel;
