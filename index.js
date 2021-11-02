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
    //new configuration parameter
    partialsDir: __dirname + '/views/partials/'
    }));

//Serves static files (we need it to import a css file)
app.use(express.static('public'))

//Serves the body of the page aka "userList.hbs" to the container "index.hbs"
app.get('/', (req, res) => {
    //Using the index.hbs file
    res.render('main', {layout: 'index'});
});

//Serves the body of the page aka "userList.hbs" to the container "index.hbs"
app.get('/users', (req, res) => {
    //Using the index.hbs file
    res.render('userList', {layout: 'index', usrData});
});

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));
