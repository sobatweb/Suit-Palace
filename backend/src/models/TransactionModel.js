const db = require('../config/db');

class TransactionModel {
    static async createOrder(orderData, bookingData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insert into booked
            const { id_jas, id_kemeja, id_celana, id_changshan, id_dasi, id_vest, id_tuxedo } = bookingData;
            const [bookedResult] = await connection.query(
                'INSERT INTO booked (id_jas, id_kemeja, id_celana, id_changshan, id_dasi, id_vest, id_tuxedo) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id_jas || null, id_kemeja || null, id_celana || null, id_changshan || null, id_dasi || null, id_vest || null, id_tuxedo || null]
            );
            const id_booked = bookedResult.insertId;

            // 2. Insert into order_items
            const {
                id_customer, id_package, start_dates, end_dates,
                total_price, amount_paid, condition_return, order_date
            } = orderData;

            const [orderResult] = await connection.query(
                `INSERT INTO order_items 
                (id_customer, id_package, id_booked, order_date, start_dates, end_dates, total_price, amount_paid, condition_return, status_rent, status_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Booked', 'Belum Selesai')`,
                [id_customer, id_package, id_booked, order_date || new Date(), start_dates, end_dates, total_price, amount_paid || 0, condition_return || '']
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

            const bookingFields = ['id_jas', 'id_kemeja', 'id_celana', 'id_changshan', 'id_dasi', 'id_vest', 'id_tuxedo'];
            const orderFields = [
                'id_customer', 'id_package', 'start_dates', 'end_dates',
                'actual_return_date', 'total_price', 'amount_paid',
                'penalty_paid', 'status_rent', 'status_order', 'condition_return'
            ];

            Object.keys(data).forEach(key => {
                if (bookingFields.includes(key)) {
                    bookingData[key] = data[key];
                } else if (orderFields.includes(key)) {
                    orderData[key] = data[key];
                }
            });

            // 1. Update order_items
            if (Object.keys(orderData).length > 0) {
                if (orderData.status_rent === 'Dikembalikan') {
                    const returnDate = new Date();
                    orderData.actual_return_date = returnDate;

                    // Ambil data end_dates dan id_package untuk hitung denda otomatis
                    const [current] = await connection.query('SELECT end_dates, id_package FROM order_items WHERE id_order = ?', [id]);
                    const endDate = new Date(current[0].end_dates);

                    // Reset jam ke 00:00 agar perhitungan hari akurat
                    endDate.setHours(0, 0, 0, 0);
                    const compareDate = new Date(returnDate);
                    compareDate.setHours(0, 0, 0, 0);

                    if (compareDate > endDate) {
                        const diffDays = Math.floor((compareDate - endDate) / (1000 * 60 * 60 * 24));
                        const [pkg] = await connection.query('SELECT penalty_fee FROM packages WHERE id_package = ?', [current[0].id_package]);
                        orderData.penalty_paid = diffDays * (pkg[0].penalty_fee || 0);
                    }
                } else if (orderData.status_rent && orderData.status_rent !== 'Dikembalikan') {
                    orderData.actual_return_date = null;
                }

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
    static async finishOrder(id, data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Handle flexible input (string or object)
            const condition_return = typeof data === 'object' ? data.condition_return : data;

            // Fix: Pastikan amount_paid diambil dengan benar jika ada (termasuk 0)
            let amount_paid = undefined;
            if (typeof data === 'object' && data !== null && data.amount_paid !== undefined && data.amount_paid !== null && data.amount_paid !== '') {
                amount_paid = Number(data.amount_paid);
            }

            // 1. Ambil data order & package untuk hitung denda otomatis
            const [orderRows] = await connection.query(
                `SELECT id_customer, end_dates, id_package, penalty_paid, actual_return_date, status_rent, amount_paid, total_price 
                 FROM order_items WHERE id_order = ?`,
                [id]
            );
            if (orderRows.length === 0) throw new Error("Order tidak ditemukan");

            const order = orderRows[0];

            // return_date tidak terupdate lagi jika sudah ada (dari status 'Dikembalikan' sebelumnya)
            // Hanya di-set jika status_rent berubah menjadi 'Dikembalikan' saat ini
            const returnDate = order.actual_return_date || new Date();
            let finalPenalty = Number(order.penalty_paid) || 0;

            // Jika belum pernah di-set 'Dikembalikan' via Edit, hitung denda sekarang
            // Dan pastikan bukan status 'Cancel'
            if (!order.actual_return_date && order.status_rent !== 'Cancel') {
                const endDate = new Date(order.end_dates);
                endDate.setHours(0, 0, 0, 0);
                const compareDate = new Date(returnDate);
                compareDate.setHours(0, 0, 0, 0);

                if (compareDate > endDate) {
                    const diffDays = Math.floor((compareDate - endDate) / (1000 * 60 * 60 * 24));
                    const [pkg] = await connection.query('SELECT penalty_fee FROM packages WHERE id_package = ?', [order.id_package]);
                    finalPenalty = diffDays * (pkg[0].penalty_fee || 0);
                }
            } else {
                // JIKA BUKAN CANCEL: Gunakan amount_paid sebagai penalty (denda manual) jika ada
                // Kecuali jika status 'Dikembalikan', kita gunakan penalty yang sudah tersimpan (tidak perlu input manual)
                if (amount_paid !== undefined && order.status_rent !== 'Dikembalikan') {
                    finalPenalty = amount_paid;
                }
            }

            // 2. Update order_items (Set status dan denda)
            const newStatusRent = order.status_rent === 'Cancel' ? 'Cancel' : 'Dikembalikan';

            let query = `UPDATE order_items 
                 SET status_rent = ?, 
                     status_order = 'Sudah Selesai', 
                     actual_return_date = ?,
                     penalty_paid = ?,
                     condition_return = ?`;

            const params = [newStatusRent, returnDate, finalPenalty, condition_return || ''];

            if (newStatusRent === 'Dikembalikan') {
                // Set amount_paid ke total_price agar history mencatat omset sesuai harga paket
                let finalAmount = order.total_price;
                
                // Fallback: Jika total_price 0 (bug entry), ambil dari master package
                if (!finalAmount) {
                     const [pkgPrice] = await connection.query('SELECT package_price FROM packages WHERE id_package = ?', [order.id_package]);
                     if (pkgPrice.length > 0) finalAmount = pkgPrice[0].package_price;
                }

                query += `, amount_paid = ?`;
                params.push(finalAmount || 0);

                // Fix: Update total_price juga jika 0, supaya Trigger MySQL mencatat omset yang benar ke history
                if (!order.total_price || Number(order.total_price) === 0) {
                    query += `, total_price = ?`;
                    params.push(finalAmount || 0);
                }
            } else if (amount_paid !== undefined) {
                query += `, amount_paid = ?`;
                params.push(amount_paid);
            }

            query += ` WHERE id_order = ?`;
            params.push(id);

            const [result] = await connection.query(query, params);

            // 3. Tambahkan denda ke total denda di tabel customers (Akumulasi)
            if (finalPenalty > 0) {
                await connection.query(
                    'UPDATE customers SET penalty_fee = IFNULL(penalty_fee, 0) + ? WHERE id_customer = ?',
                    [finalPenalty, order.id_customer]
                );
            }

            await connection.commit();
            return result.affectedRows;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
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
