const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL connection pool (configure as needed)
const pool = mysql.createPool({
  host: '187.127.129.44',
  user: 'crmuser',
  password: 'Moneymitra@123',
  database: 'loans'
});

// Create (Insert) a new payout
router.post('/payouts', async (req, res) => {
  const { payoutdate, payoutmethod } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO payout (payoutdate, payoutmethod) VALUES (?, ?)',
      [payoutdate, payoutmethod]
    );
    res.status(201).json({ id: result.insertId, payoutdate, payoutmethod });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read (Get) all payouts
router.get('/payouts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payout');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Currentmonth fetching
router.get('/payouts/currentmonth', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM payout WHERE MONTH(payoutdate) = MONTH(CURRENT_DATE()) AND YEAR(payoutdate) = YEAR(CURRENT_DATE())`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Read (Get) a single payout by id
router.get('/payouts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM payout WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Payout not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a payout by id
router.put('/payouts/:id', async (req, res) => {
  const { id } = req.params;
  const { payoutdate, payoutmethod } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE payout SET payoutdate = ?, payoutmethod = ? WHERE id = ?',
      [payoutdate, payoutmethod, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Payout not found' });
    res.json({ id, payoutdate, payoutmethod });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a payout by id
router.delete('/payouts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM payout WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Payout not found' });
    res.json({ message: 'Payout deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
