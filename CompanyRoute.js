// file: companyRoutes.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Create a pool or connection for your DB
const pool = mysql.createPool({
  host: '187.127.129.44',
  user: 'crmuser',
  password: 'Moneymitra@123',
  database: 'loans'
});

// CREATE a company
router.post('/company', async (req, res) => {
    const { name, category, accessLevel, isActive } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO company (name, category, accessLevel, isActive) VALUES (?, ?, ?, ?)',
            [name, category, accessLevel, isActive]
        );
        res.status(201).json({ id: result.insertId, name, category, accessLevel, isActive });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ all companies
router.get('/company', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM company');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ one company by id
router.get('/company/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM company WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Company not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE a company
router.put('/company/:id', async (req, res) => {
    const { name, category, accessLevel, isActive } = req.body;
    try {
        const [result] = await pool.execute(
            'UPDATE company SET name = ?, category = ?, accessLevel = ?, isActive = ? WHERE id = ?',
            [name, category, accessLevel, isActive, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Company not found' });
        res.json({ id: req.params.id, name, category, accessLevel, isActive });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a company
router.delete('/company/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM company WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Company not found' });
        res.json({ message: 'Company deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
