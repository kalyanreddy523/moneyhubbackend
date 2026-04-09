const express = require('express');
const mysql = require('mysql2/promise');
const app = express.Router();


// MySQL database connection pool
const pool = mysql.createPool({
  host: '187.127.129.44',
  user: 'crmuser',
  password: 'Moneymitra@123',
  database: 'loans',      // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Routes

// Create a new lead
app.post('/leads', async (req, res) => {
  const { Name, Email, PhoneNo, Product, Investment, Date, Notes, SubmittedBy } = req.body;

  try {
    const sql = `INSERT INTO leads 
      (Name, Email, PhoneNo, Product, Investment, Date, Notes, SubmittedBy) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [Name, Email, PhoneNo, Product, Investment, Date, Notes, SubmittedBy];
    const [result] = await pool.execute(sql, params);
    res.status(201).json({ message: 'Lead created', insertId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Updating Assinedto
app.post('/leads/:id/update-assignedto', async (req, res) => {
  const { assignedto } = req.body;
  const leadId = req.params.id;
  try {
    // Example: Update assignedto column for a specific Lead or batch condition
    const sql = 'UPDATE leads SET assignedto = ? WHERE ID= ?'; 
    // Replace some_condition to target specific rows as needed
    await pool.query(sql, [assignedto, leadId]);

    res.status(200).json({ message: 'AssignedTo updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Updating the Status
app.post('/leads/:id/update-status', async (req, res) => {
  const { status } = req.body;
  const leadId = req.params.id;
  try {
    const sql = 'UPDATE leads SET Status = ? WHERE ID = ?';
    await pool.query(sql, [status, leadId]);

    res.status(200).json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Read all leads
app.get('/leads', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM leads');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/managers/leads', async (req, res) => {
  console.log("🔥 /manager/leads HIT");

  try {
    const { managerid } = req.query;
    console.log("Manager ID:", managerid);

    if (!managerid) {
      return res.status(400).json({ error: 'managerid is required' });
    }

    const [rows] = await pool.query(`
      SELECT l.*, a.Name AS agentName
      FROM leads l
      JOIN Agents a ON l.SubmittedBy = a.id
      WHERE a.managerid = ?
    `, [managerid]);

    console.log("Rows found:", rows.length);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Pending Leads with id
app.get('/leads/pending/:id', async (req, res) => {
  const leadId = req.params.id;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM leads WHERE Status = 'pending' AND SubmittedBy = ?",
      [leadId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// pendind leads with assignedto
app.get('/partnerleads/pending/:id', async (req, res) => {
  const leadId = req.params.id;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM leads WHERE Status = 'pending' AND assignedto = ?",
      [leadId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assinedto leads
app.get('/leads/assignedto/:assignedToId', async (req, res) => {
  const assignedToId = req.params.assignedToId;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM leads WHERE assignedto = ?",
      [assignedToId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// pending leads
app.get('/leads/pending', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM leads WHERE Status = 'pending'",
      []
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// completed leads
app.get('/leads/completed', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM leads WHERE Status = 'completed'",
      []
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Completed leads by assinedto
app.get('/partnerleads/completed/:id', async (req, res) => {
  const leadId = req.params.id;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM leads WHERE Status = 'completed' AND assignedto = ?",
      [leadId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Completed leads by ID
app.get('/leads/completed/:id', async (req, res) => {
  const leadId = req.params.id;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM leads WHERE Status = 'completed' AND SubmittedBy = ?",
      [leadId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Read a lead by ID
app.get('/leads/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM leads WHERE SubmittedBy = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a lead by ID
app.put('/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { Name, Email, PhoneNo, Product, Investment, Date, Notes, CreatedDate } = req.body;
  try {
    const sql = `UPDATE leads SET 
      Name = ?, Email = ?, PhoneNo = ?, Product = ?, Investment = ?, Date = ?, Notes = ?, CreatedDate = ? 
      WHERE ID = ?`;
    const params = [Name, Email, PhoneNo, Product, Investment, Date, Notes, CreatedDate, id];
    const [result] = await pool.execute(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a lead by ID
app.delete('/leads/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM leads WHERE ID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=app;
