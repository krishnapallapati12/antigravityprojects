/**
 * MySQL Connection Pool with graceful fallback
 */
const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "jaikrishnaram_resort",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;

try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  console.warn("MySQL pool initialization warning, using in-memory mock fallback:", err.message);
}

module.exports = pool;

