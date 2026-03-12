// partnerRoutes.js
const express = require('express');
const db = require('./db'); // Your database connection file
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// CREATE
router.post('/addpartner', (req, res) => {
  const partnerData = {
    id: uuidv4(),  // Generate alphanumeric UUID
    ...req.body,
  };
  db.query('INSERT INTO Partner SET ?', partnerData, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(partnerData);
  });
});

// LOGIN
router.post('/login', (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    return res.status(400).json({ error: 'Email and Password are required' });
  }
  
  db.query('SELECT * FROM Partner WHERE Email = ? AND Password = ?', [Email, Password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid Email or Password' });
    }
    res.json({ message: 'Login successful', partner: results[0] });
  });
});


// READ ALL
router.get('/', (req, res) => {
  db.query('SELECT * FROM Partner', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// READ PARTNER
router.get('/role', (req, res) => {
  const sql = 'SELECT * FROM Partner WHERE Role = ?';
  db.query(sql, ['partner_company'], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results);
  });
});


// READ ONE
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Partner WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results);
  });
});

// UPDATE
router.put('/:id', (req, res) => {
  db.query('UPDATE Partner SET ? WHERE id = ?', [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Updated successfully' });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Partner WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted successfully' });
  });
});

module.exports = router;
