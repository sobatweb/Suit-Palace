const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'suitpalace_db_serpong',
  waitForConnections: true,
  connectionLimit: 10
});

console.log("Database Config:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME || 'suitpalace_db_serpong (fallback)'
});

module.exports = pool;
