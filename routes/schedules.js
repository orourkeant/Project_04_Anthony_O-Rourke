//Loads the express module
const express = require('express');
const router = express.Router();

//Require .env
require('dotenv').config();

//Require bodyparser
const bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Require validator for validating form data
const validator = require('validator');

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

//Serves the body of the page aka "schedList.hbs" to the container "index.hbs"
router.get('/', (req, res) => {
    
    connection.query('SELECT user_id, day, start_time, end_time FROM schedules order by user_id;', (err,rows) => {
        if(err) throw err;
            //Using the index.hbs file
            console.log(rows);
            res.render('schedList', {layout: 'index', rows});
    });  
});



router.get('/new', function(req, res){
    res.render('schedForm', {layout: 'index'});
});

router.post('/new', urlencodedParser, function (req, res) {
    //HTML time doesn't have seconds
    let seconds = ':00';
    let startTime = req.body.start_at.concat('', seconds);
    let endTime = req.body.end_at.concat('', seconds);
 
    // Need a Date Object to extract the day for DB table
    let date = new Date(Date.parse(req.body.day));

    //Pull the day from the date, add one due to zero-based indexing.
    let day = date.getDay() + 1;

    //Convert Date to ISOString and strip the time segment
    let dateString = date.toISOString().slice(0, 11).replace('T', ' ');

    //concat the dateString with the startTime
    let startTimeISOString = dateString.concat('', startTime);
    
    //concat the dateString with the endTime
    let endTimeISOString = dateString.concat('', endTime);

    const records = [Number(req.body.user_id), day, startTimeISOString, endTimeISOString];

    connection.query('INSERT INTO schedules ( user_id, day, start_time, end_time ) VALUES (?);', [records], (err,rows) => {
        if(err) throw err;              
        console.log(rows);
    });

    res.redirect('/new');
});

module.exports = router;