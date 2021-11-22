//Loads the express module
const express = require('express');

//Require .env
require('dotenv').config();

//Require bodyparser
const bodyParser = require("body-parser");

//Require validator for validating form data
const validator = require('validator');

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Creates our express server
const app = express();
const port = 3000;

//Setup the DB
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});
connection.connect((err) => {
  if (err) throw err;
  console.log('DB Connected!');
});

//Require the data JSON
const myData = require('./data');
const usrData = myData.users; //Create a users object from the json 
const schedData = myData.schedules; //Create a schedule data object from the json

//Loads the handlebars module
const handlebars = require('express-handlebars');

//app.enable('strict routing');

//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');

//Sets handlebars configurations (we will go through them later on)
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials/'
    }));

//Serves static files (we need it to import a css file)
app.use(express.static('public'));
app.use(urlencodedParser);

//Serves the body of the page aka "main.hbs" to the container "index.hbs"
app.get('/', (req, res) => {
    //Using the index.hbs file
    res.render('main', {layout: 'index'});
});

//Serves the body of the page aka "userList.hbs" to the container "index.hbs"
app.get('/users', (req, res) => {
    
    connection.query('SELECT first_name, last_name, email, password FROM users ORDER BY id;', (err,rows) => {
        if(err) throw err;
            //Using the index.hbs file
        res.render('userList', {layout: 'index', rows});
    });
    
});

//Serves the body of the page aka "schedList.hbs" to the container "index.hbs"
app.get('/schedules', (req, res) => {
    
    connection.query('SELECT user_id, day, start_time, end_time FROM schedules order by user_id;', (err,rows) => {
        if(err) throw err;
            //Using the index.hbs file
            console.log(rows);
            res.render('schedList', {layout: 'index', rows});
    });  
});



app.get('/schedules/new', function(req, res){
    res.render('schedForm', {layout: 'index'});
});

app.post('/schedules/new', urlencodedParser, function (req, res) {
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
    console.log('records: ', records);

    console.log('Body: ', req.body);

    connection.query('INSERT INTO schedules ( user_id, day, start_time, end_time ) VALUES (?);', [records], (err,rows) => {
        if(err) throw err;              
        console.log(rows);
    });

    res.redirect('/schedules/new');
    
    
});

app.get('/users/new', function(req, res){
    res.render('userForm', {layout: 'index'});
});

app.post('/users/new', function(req, res){
    //Trim the input data
    let fName = validator.trim(req.body.firstname);
    let lName = validator.trim(req.body.lastname);
    let email = validator.trim(req.body.email);
    let pass = validator.trim(req.body.password);
    
    //handle the password encryption
    const crypto = require('crypto');
	const encryptPassword = crypto.createHash('sha256').update(pass).digest('base64');
    
    //Escape the name inputs
    fName =validator.escape(fName);
    lName = validator.escape(lName);

    //If the email is valid, insert the new user to the DB
    if(validator.isEmail(email)){
        //Create an array for inserting the variables to the query
        const records = [fName, lName, email, encryptPassword];
            connection.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?);', [records], (err,rows) => {
                if(err) throw err;              
                console.log(rows);
            });
    }
    
    //Redirect back to the get route
    res.redirect('/users/new');
});

//Had to move the parameterised route underneath the new routes
//Handle individual user routes if they exist, send error message if not...
app.get('/users/:userId', function (req, res){
	
	let ID = parseInt(req.params.userId);

    connection.query('SELECT first_name, last_name, email, password FROM users WHERE id = ?;', ID, (err,rows) => {
        if(err)throw err;      
            res.render('singleUser', {layout: 'index', rows});
    });
    
});

app.get('/users/:userId/schedules', function (req, res){
    // check that the parameter value has a match as an array value in the users
    // section of the JSON file
    let ID = parseInt(req.params.userId);

    connection.query('SELECT user_id, day, start_time, end_time FROM schedules WHERE user_id = ?;', ID, (err,rows) => {
        if(err) throw err;
            //Using the index.hbs file
            console.log(rows);
            res.render('singleSched', {layout: 'index', rows});
    });


});

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));
