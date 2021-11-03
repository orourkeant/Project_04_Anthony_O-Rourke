//Loads the express module
const express = require('express');

const bodyParser = require("body-parser");
// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });
//Creates our express server
const app = express();
const port = 3000;
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
    //Using the index.hbs file
    res.render('userList', {layout: 'index', usrData});
});

//Serves the body of the page aka "schedList.hbs" to the container "index.hbs"
app.get('/schedules', (req, res) => {
    //Using the index.hbs file
    res.render('schedList', {layout: 'index', schedData});
});

app.get('/users/:userId/schedules', function (req, res){
    // check that the parameter value has a match as an array value in the users
    // section of the JSON file
    let ID = parseInt(req.params.userId);
    
    let scheduleInfo = schedData.filter(obj => {return ID == obj.user_id});
	if(scheduleInfo.length === 0){
		res.send("No schedule info for this user!\n")
	}else{
		res.render('singleSched', {layout: 'index', scheduleInfo});
	}
});

app.get('/schedules/new', function(req, res){
    res.render('schedForm', {layout: 'index'});
});

app.post('/schedules/new', urlencodedParser, function (req, res) {
    schedData.push(req.body);	
    res.redirect('/schedules/new');
});

app.get('/users/new', function(req, res){
    res.render('userForm', {layout: 'index'});
});

app.post('/users/new', function(req, res){
    //handle the password encryption
    let crypto = require('crypto');
	const encryptPassword = crypto.createHash('sha256').update(req.body.password).digest('base64');
	req.body.password = encryptPassword
    //push the data 
    usrData.push(req.body);
    res.redirect('/users/new');
});

//Had to move the parameterised route underneath the new routes
//Handle individual user routes if they exist, send error message if not...
app.get('/users/:userId', function (req, res){
	// check that the parameter value has a match as an array value in the users
	// section of the JSON file
    let ID = parseInt(req.params.userId);
	const hasValue = usrData.includes(usrData[ID]);
    let user = usrData[ID];
    
  	if(hasValue){ // if the match exists, respond with the associated JSON payload
        res.render('singleUser', {layout: 'index', user});
  	}else{ // if it doesn't exist then the user doesn't exist, send this message:
  		res.send("No such user!\n");
    }
    
});

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));
