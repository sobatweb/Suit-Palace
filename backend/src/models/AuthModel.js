const db = require('../config/db');

class AuthModel {
    static async findAdminByUsername(username) {
        const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        return rows[0];
    }
}

module.exports = AuthModel;
