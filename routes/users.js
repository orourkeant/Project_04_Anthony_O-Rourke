//Loads the express module
const express = require('express');
const router = express.Router();

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

//^^ Duplication here with DB, needs to be removed later, maybe export from the main index.js

//Serves the body of the page aka "userList.hbs" to the container "index.hbs"
router.get('/', (req, res) => {
    connection.query('SELECT first_name, last_name, email, password FROM users ORDER BY id;', (err,rows) => {
        if(err) throw err;
            //Using the index.hbs file
        res.render('userList', {layout: 'index', rows});
    });  
});

// //Had to move the parameterised route underneath the new routes
// //Handle individual user routes if they exist, send error message if not...
router.get('/:userId', function (req, res){
	
	let ID = parseInt(req.params.userId);

    connection.query('SELECT first_name, last_name, email, password FROM users WHERE id = ?;', ID, (err,rows) => {
        if(err)throw err;      
            res.render('singleUser', {layout: 'index', rows});
    });    
});

router.get('/:userId/schedules', function (req, res){
    
    let ID = parseInt(req.params.userId);

    connection.query('SELECT user_id, day, start_time, end_time FROM schedules WHERE user_id = ?;', ID, (err,rows) => {
        if(err) throw err;
            //Using the index.hbs file
            console.log(rows);
            res.render('singleSched', {layout: 'index', rows});
    });

});


module.exports = router;