//Loads the express module
const express = require('express');
//Creates our express server
const app = express();
const port = 3000;
//Require the data JSON
const myData = require('./data');
const usrData = myData.users; //Create a users object from the json 
const schedData = myData.schedules; //Create a schedule data object from the json

//Loads the handlebars module
const handlebars = require('express-handlebars');

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

//Serves the body of the page aka ".hbs" to the container "index.hbs"
app.get('/schedules', (req, res) => {
    //Using the index.hbs file
    res.render('schedList', {layout: 'index', schedData});
});

//Handle individual user routes if they exist, send error message if not...
app.get('/users/:userId/', function (req, res){
	// check that the parameter value has a match as an array value in the users
	// section of the JSON file
    let ID = parseInt(req.params.userId);
	const hasValue = usrData.includes(usrData[ID]);
    let user = usrData[ID];
  	if(hasValue){ // if the match exists, respond with the associated JSON payload
  		//res.json(myData.users[req.params.userId]);
          res.render('singleUser', {layout: 'index', user});
  	}else{ // if it doesn't exist then the user doesn't exist, send this message:
  		res.send("No such user!\n");
    }
});

app.get('/users/:userId/', function (req, res){
    // check that the parameter value has a match as an array value in the users
    // section of the JSON file
    let ID = parseInt(req.params.userId);
    const hasValue = usrData.includes(usrData[ID]);
    let user = usrData[ID];
        if(hasValue){ // if the match exists, respond with the associated JSON payload
            //res.json(myData.users[req.params.userId]);
            res.render('singleUser', {layout: 'index', user});
        }else{ // if it doesn't exist then the user doesn't exist, send this message:
            res.send("No such user!\n");
        }
});

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));
