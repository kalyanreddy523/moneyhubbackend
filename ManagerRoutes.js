// managerRoutes.js
const express = require("express");
const router = express.Router();
const db = require("./db");

// CREATE Manager
router.post("/create", (req, res) => {
  const { Name, Email, Password, Mobile, Location, Role } = req.body;

  const sql = `INSERT INTO Manager (Name, Email, Password, Mobile, Location, Role)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [Name, Email, Password, Mobile, Location, Role], (err, result) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    res.json({ status: "success", message: "Manager created", id: result.insertId });
  });
});

// READ - Get All Managers
router.get("/", (req, res) => {
  const sql = "SELECT * FROM Manager";

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ status: "error", error: err });
    res.json({ status: "success", data: rows });
  });
});

// READ - Get Single Manager by ID
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM Manager WHERE id = ?";
  
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ status: "error", error: err });

    if (rows.length === 0)
      return res.status(404).json({ status: "error", message: "Manager not found" });

    res.json({ status: "success", data: rows[0] });
  });
});

// UPDATE Manager
router.put("/update/:id", (req, res) => {
  const { Name, Email, Password, Mobile, Location, Role } = req.body;
  const sql = `
    UPDATE Manager 
    SET Name=?, Email=?, Password=?, Mobile=?, Location=?, Role=?
    WHERE id = ?
  `;

  db.query(sql, [Name, Email, Password, Mobile, Location, Role, req.params.id], (err) => {
    if (err) return res.status(500).json({ status: "error", error: err });

    res.json({ status: "success", message: "Manager updated" });
  });
});

// DELETE Manager
router.delete("/delete/:id", (req, res) => {
  const sql = "DELETE FROM Manager WHERE id = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ status: "error", error: err });

    res.json({ status: "success", message: "Manager deleted" });
  });
});

module.exports = router;
