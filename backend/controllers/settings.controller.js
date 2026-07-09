const pool = require('../config/db');

exports.getAiSettings = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await pool.query('SELECT ai_provider, ai_model FROM user_ai_settings WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
      return res.status(200).json({ ai_provider: 'gemini', ai_model: 'gemini-2.5-flash' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.saveAiSettings = async (req, res) => {
  const { user_id, ai_provider, ai_model } = req.body;
  if (!user_id || !ai_provider || !ai_model) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO user_ai_settings (user_id, ai_provider, ai_model)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE 
       SET ai_provider = EXCLUDED.ai_provider, ai_model = EXCLUDED.ai_model
       RETURNING *`,
      [user_id, ai_provider, ai_model]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving AI settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
