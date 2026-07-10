require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('Running linked_accounts migration...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS linked_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        bank_name VARCHAR(100) NOT NULL,
        account_type VARCHAR(50) NOT NULL,
        balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        access_token VARCHAR(255),
        last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Migration successful: linked_accounts table created!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    pool.end();
  }
}

migrate();
