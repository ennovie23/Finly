const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON request bodies

// 🖥️ Initialize the PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // 🛠️ Set this to false to resolve the SSL handshake error
});

// 📥 1. POST ROUTE: Save a new expense to the database
app.post('/api/expenses', async (req, res) => {
  try {
    const { amount, category, description } = req.body;
    
    const queryText = `
      INSERT INTO expenses (amount, category, description) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    
    const values = [amount, category, description];
    const result = await pool.query(queryText, values);
    
    res.status(201).json(result.rows[0]); // Returns the saved row back to the client
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while saving expense.');
  }
});

// 📤 2. GET ROUTE: Fetch all logged expenses from the database
app.get('/api/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC;');
    res.json(result.rows); // Returns the array of expenses as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while fetching expenses.');
  }
});

// Test Endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW();');
    res.json({ status: 'Connected to PostgreSQL!', timestamp: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  }
});

app.get('/', (req, res) => {
  res.send("Finly backend engine is breathing smoothly!");
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});