const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'loans',
});

// Create a commission
router.post('/commision', async (req, res) => {
  const { ProductType, Partnercomission, Goldcomission, Premiumcomission } = req.body;
  try {
    const sql = 'INSERT INTO Commision (ProductType, Partnercomission, Goldcomission, Premiumcomission) VALUES (?, ?, ?, ?)';
    await pool.query(sql, [ProductType, Partnercomission, Goldcomission, Premiumcomission]);
    res.status(201).json({ message: 'Commission created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Read all commissions
router.get('/commision', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Commision');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read one commission by Id
router.get('/commision/:id', async (req, res) => {
  const Id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM Commision WHERE Id = ?', [Id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Commission not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a commission by Id
router.put('/commision/:id', async (req, res) => {
  const Id = req.params.id;
  const { ProductType, Partnercomission, Goldcomission, Premiumcomission } = req.body;
  try {
    const sql = 'UPDATE Commision SET ProductType = ?, Partnercomission = ?, Goldcomission = ?, Premiumcomission = ? WHERE Id = ?';
    const [result] = await pool.query(sql, [ProductType, Partnercomission, Goldcomission, Premiumcomission, Id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Commission not found' });
    res.json({ message: 'Commission updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a commission by Id
router.delete('/commision/:id', async (req, res) => {
  const Id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM Commision WHERE Id = ?', [Id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Commission not found' });
    res.json({ message: 'Commission deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
