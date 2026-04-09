const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '187.127.129.44',
  user: 'crmuser',
  password: 'Moneymitra@123',
  database: 'loans'

  // host: 'localhost',
  // user: 'root',
  // password: 'root',
  // database: 'loans'
});

module.exports = connection;