const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'crmuser',
  password: 'Moneymitra@123',
  database: 'loans'
});

module.exports = connection;