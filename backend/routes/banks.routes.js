const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Securely link a new mock bank account
router.post('/link', async (req, res) => {
  try {
    const { bank_name, account_type, balance } = req.body;
    
    // In a real Open Banking flow, we would receive a token here, not the balance.
    // For this Mock flow, we generate a fake token and save the mocked balance.
    
    const userResult = await pool.query('SELECT id FROM users LIMIT 1');
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const userId = userResult.rows[0].id;
    
    // Check if the user already linked this bank
    const existingCheck = await pool.query(
      'SELECT id FROM linked_accounts WHERE user_id = $1 AND bank_name = $2',
      [userId, bank_name]
    );

    let result;
    if (existingCheck.rows.length > 0) {
      // Update existing balance
      result = await pool.query(
        `UPDATE linked_accounts 
         SET balance = $1, last_synced_at = CURRENT_TIMESTAMP 
         WHERE id = $2 RETURNING *`,
        [balance, existingCheck.rows[0].id]
      );
    } else {
      // Insert new bank
      const fakeToken = `tok_mock_${Math.random().toString(36).substr(2, 9)}`;
      result = await pool.query(
        `INSERT INTO linked_accounts (user_id, bank_name, account_type, balance, access_token) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, bank_name, account_type, balance, fakeToken]
      );
    }

    res.json({ success: true, account: result.rows[0] });
  } catch (error) {
    console.error('Error linking account:', error);
    res.status(500).json({ error: 'Internal server error linking account' });
  }
});

// Fetch all linked accounts for a user
router.get('/accounts', async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id FROM users LIMIT 1');
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const userId = userResult.rows[0].id;

    const result = await pool.query(
      'SELECT id, bank_name, account_type, balance, last_synced_at FROM linked_accounts WHERE user_id = $1 ORDER BY created_at ASC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching linked accounts:', error);
    res.status(500).json({ error: 'Internal server error fetching accounts' });
  }
});

module.exports = router;
