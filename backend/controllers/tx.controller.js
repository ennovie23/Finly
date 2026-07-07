const pool = require('../config/db');

// Save a new expense to the database
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, description, date, user_id } = req.body;
    
    const queryText = `
      INSERT INTO expenses (amount, category, description, date, user_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *;
    `;
    
    const values = [amount, category, description, date, user_id];
    const result = await pool.query(queryText, values);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while saving expense.');
  }
};

// Fetch active logged expenses from the database (deleted_at IS NULL)
exports.getExpenses = async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await pool.query(
      'SELECT * FROM expenses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY date DESC;',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while fetching expenses.');
  }
};

// Soft delete an expense (update deleted_at timestamp)
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE expenses SET deleted_at = NOW() WHERE id = $1', [id]);
    res.status(200).json({ message: 'Expense soft-deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while soft-deleting expense.');
  }
};

// Fetch all soft-deleted expenses (deleted_at IS NOT NULL)
exports.getTrashedExpenses = async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await pool.query(
      'SELECT * FROM expenses WHERE user_id = $1 AND deleted_at IS NOT NULL ORDER BY deleted_at DESC;',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while fetching trashed expenses.');
  }
};

// Restore a soft-deleted expense (set deleted_at to NULL)
exports.restoreExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE expenses SET deleted_at = NULL WHERE id = $1', [id]);
    res.status(200).json({ message: 'Expense restored successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while restoring expense.');
  }
};

// Hard delete / purge an expense permanently from DB
exports.purgeExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
    res.status(200).json({ message: 'Expense permanently deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while purging expense.');
  }
};

// Clear all trashed expenses for a user permanently
exports.clearTrash = async (req, res) => {
  try {
    const { user_id } = req.query;
    await pool.query('DELETE FROM expenses WHERE user_id = $1 AND deleted_at IS NOT NULL', [user_id]);
    res.status(200).json({ message: 'Trash cleared successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while clearing trash.');
  }
};

// Update an existing expense in the database
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    
    const queryText = `
      UPDATE expenses 
      SET amount = $1, category = $2, description = $3, date = $4 
      WHERE id = $5 
      RETURNING *;
    `;
    
    const result = await pool.query(queryText, [amount, category, description, date, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while updating expense.');
  }
};
