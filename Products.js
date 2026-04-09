const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL connection pool
const pool = mysql.createPool({
  host: '187.127.129.44',
  user: 'crmuser',
  password: 'Moneymitra@123',
  database: 'loans'
});

// Create a product entry
router.post('/products', async (req, res) => {
  const { producttype, productnames, Partnercomission, Goldcomission, Premiumcomission, Managercomission } = req.body;
  try {
    const productnamesJson = productnames ? JSON.stringify(productnames) : null;
    const sql = `
      INSERT INTO Products 
      (producttype, productnames, Partnercomission, Goldcomission, Premiumcomission, Managercomission) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [producttype, productnamesJson, Partnercomission, Goldcomission, Premiumcomission, Managercomission]);
    res.status(201).json({ message: 'Product created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all products
router.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Products');
    const products = rows.map(row => ({
      producttype: row.producttype,
      productnames: row.productnames || [],
      Partnercomission: row.Partnercomission,
      Goldcomission: row.Goldcomission,
      Premiumcomission: row.Premiumcomission,
      Managercomission: row.Managercomission
    }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read one product by producttype
router.get('/products/:producttype', async (req, res) => {
  const producttype = req.params.producttype;
  try {
    const [rows] = await pool.query('SELECT * FROM Products WHERE TRIM(producttype) = TRIM(?)', [producttype]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    const row = rows[0];
    const product = {
      producttype: row.producttype?.trim(),
      productnames: row.productnames.map(name => name.trim()),
      Partnercomission: row.Partnercomission,
      Goldcomission: row.Goldcomission,
      Premiumcomission: row.Premiumcomission,
      Managercomission: row.Managercomission
    };
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product details including the commission columns for a producttype
router.put('/products/:producttype', async (req, res) => {
  const producttype = req.params.producttype;
  const { productnames, Partnercomission, Goldcomission, Premiumcomission, Managercomission } = req.body;
  try {
    const productnamesJson = productnames ? JSON.stringify(productnames) : null;
    const sql = `
  UPDATE Products 
  SET productnames = ?, Partnercomission = ?, Goldcomission = ?, Premiumcomission = ?, Managercomission = ? 
  WHERE TRIM(producttype) = TRIM(?)
`;
    const [result] = await pool.query(sql, [productnamesJson, Partnercomission, Goldcomission, Premiumcomission, Managercomission, producttype]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product by producttype
router.delete('/products/:producttype', async (req, res) => {
  const producttype = req.params.producttype;
  try {
    const [result] = await pool.query('DELETE FROM Products WHERE producttype = ?', [producttype]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
