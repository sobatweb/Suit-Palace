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
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Separate booking data if present
            const bookingData = {};
            const orderData = {};

            const bookingFields = ['id_jas', 'id_kemeja', 'id_celana', 'id_changshan', 'id_dasi'];

            Object.keys(data).forEach(key => {
                if (bookingFields.includes(key)) {
                    bookingData[key] = data[key];
                } else if (!key.startsWith('display_') && !key.startsWith('customer_') && !key.startsWith('package_') && key !== 'booked_items' && key !== 'id_order') {
                    // Filter out synthetic display fields and the ID itself
                    orderData[key] = data[key];
                }
            });

            // 1. Update order_items
            if (Object.keys(orderData).length > 0) {
                const keys = Object.keys(orderData);
                const values = Object.values(orderData);
                const setClause = keys.map(key => `${key} = ?`).join(', ');
                await connection.query(`UPDATE order_items SET ${setClause} WHERE id_order = ?`, [...values, id]);
            }

            // 2. Update booked (if booking items were passed)
            if (Object.keys(bookingData).length > 0) {
                // Get id_booked from order
                const [orderRows] = await connection.query('SELECT id_booked FROM order_items WHERE id_order = ?', [id]);
                if (orderRows.length > 0) {
                    const id_booked = orderRows[0].id_booked;
                    const keys = Object.keys(bookingData);
                    const values = Object.values(bookingData);
                    const setClause = keys.map(key => `${key} = ?`).join(', ');
                    await connection.query(`UPDATE booked SET ${setClause} WHERE id_booked = ?`, [...values, id_booked]);
                }
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
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

    static async deleteOrder(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Get id_booked first
            const [rows] = await connection.query('SELECT id_booked FROM order_items WHERE id_order = ?', [id]);
            if (rows.length > 0) {
                const id_booked = rows[0].id_booked;

                // 2. Delete order_items
                await connection.query('DELETE FROM order_items WHERE id_order = ?', [id]);

                // 3. Delete booked
                if (id_booked) {
                    await connection.query('DELETE FROM booked WHERE id_booked = ?', [id_booked]);
                }
            }

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

module.exports = TransactionModel;
