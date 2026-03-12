const express = require('express');
const router = express.Router();
const db = require('./db'); // Import your DB connection

// CREATE a new partner
router.post('/', (req, res) => {
  const { id, Name, Email, Password, Mobile, Location, Role } = req.body;
  db.query(
    'INSERT INTO Partner (id, Name, Email, Password, Mobile, Location, Role) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, Name, Email, Password, Mobile, Location, Role],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Admin created', id });
    }
  );
});

// READ all partners
router.get('/', (req, res) => {
  db.query('SELECT * FROM Partner', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// READ partner by id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Partner WHERE id=?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Partner not found' });
    res.json(results);
  });
});

// UPDATE partner by id
router.put('/:id', (req, res) => {
  const { Name, Email, Password, Mobile, Location, Role } = req.body;
  db.query(
    'UPDATE Partner SET Name=?, Email=?, Password=?, Mobile=?, Location=?, Role=? WHERE id=?',
    [Name, Email, Password, Mobile, Location, Role, req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Partner updated' });
    }
  );
});

// DELETE partner by id
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Partner WHERE id=?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Partner deleted' });
  });
});

module.exports = router;
