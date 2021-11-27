//Loads the express module
const express = require('express');
const app = express();

//Serves the body of the page aka "main.hbs" to the container "index.hbs"
app.get('/', (req, res) => {
    //Using the index.hbs file
    res.render('main', {layout: 'index'});
});



module.exports = app;