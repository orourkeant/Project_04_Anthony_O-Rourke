//Require .env
require('dotenv').config();

//Setup the DB
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});
connection.connect((err) => {
  if (err) throw err;
  console.log('DB Connected!');
});

module.exports = connection;