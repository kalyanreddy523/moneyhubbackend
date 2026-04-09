const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');


const app = express.Router();



// MySQL database connection
const db = mysql.createPool({
  host: '187.127.129.44',
  user: 'crmuser',
  password: 'Moneymitra@123',
  database: 'loans'
});

// Helper: Exclude password from agent output
function excludePassword(agent) {
  if (agent && agent.Password !== undefined) {
    const { Password, ...rest } = agent;
    return rest;
  }
  return agent;
}

// Create a new agent
app.post('/agents', async (req, res) => {
  const { Name, Email, Password, Mobile, Location, Role, Experience, Motivation, managerid } = req.body;

  if (!Password) return res.status(400).json({ error: 'Password is required' });

  try {
    const hash = await bcrypt.hash(Password, 10);
    const agentId = uuidv4(); // alphanumeric ID

    const query = `
      INSERT INTO Agents 
      (id, Name, Email, Password, Mobile, Location, Role, Experience, Motivation, managerid)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [agentId, Name, Email, hash, Mobile, Location, Role, Experience, Motivation, managerid],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          id: agentId,
          Name,
          Email,
          Mobile,
          Location,
          Role,
          Experience,
          Motivation,
          managerid
        });
      }
    );

  } catch (err) {
    res.status(500).json({ error: 'Password hashing failed' });
  }
});

// Login for Agents
app.post('/agents/login', (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }
  // Query agent by email
  const query = `SELECT * FROM Agents WHERE Email = ?`;
  db.query(query, [Email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ success: false, error: "Account not found or invalid credentials" });
    }
    const agent = results[0];
    // Check password
    try {
      const match = await bcrypt.compare(Password, agent.Password);
      if (!match) {
        return res.status(401).json({ success: false, error: "Account not found or invalid credentials" });
      }
      // Don't send password hash in the response
      const { Password: _, ...agentWithoutPassword } = agent;
      return res.json({ success: true, user: agentWithoutPassword });
    } catch (err) {
      return res.status(500).json({ success: false, error: "Password verification failed" });
    }
  });
});

// Get all agents (do NOT return password)
app.get('/agents', (req, res) => {
  db.query('SELECT * FROM Agents', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const safeResults = results.map(excludePassword);
    res.json(safeResults);
  });
});

// Get an agent by id (do NOT return password)
app.get('/agents/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Agents WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Agent not found' });
    res.json(excludePassword(results[0]));
  });
});

// Update an agent by id (hash password if provided)
app.put('/agents/:id', (req, res) => {
  const { id } = req.params;
  const { Name, Email, Mobile, Location } = req.body;

  const query = `
    UPDATE Agents
    SET Name = ?, Email = ?, Mobile = ?, Location = ?
    WHERE id = ?
  `;
  const params = [Name, Email, Mobile, Location, id];

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Agent not found' });

    res.json({ id, Name, Email, Mobile, Location });
  });
});


// Delete an agent by id
app.delete('/agents/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Agents WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Agent not found' });
    res.json({ message: 'Agent deleted successfully' });
  });
});

module.exports=app;
