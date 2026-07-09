const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const values = [1350, 'Others', 'Test', '2026-07-09', 1, '', 'GCash'];
pool.query("INSERT INTO expenses (amount, category, description, date, user_id, receipt_url, merchant) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;", values)
  .then(res => { console.log(res.rows); process.exit(0); })
  .catch(err => { console.error("DB Error:", err.message); process.exit(1); });
