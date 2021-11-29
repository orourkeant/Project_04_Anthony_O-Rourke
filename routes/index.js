//Loads the express module
const express = require('express');
const router = express.Router();

// use Router in MVC files ***

//Serves the body of the page aka "main.hbs" to the container "index.hbs"
router.get('/', (req, res) => {
    //Using the index.hbs file
    res.render('main', {layout: 'index'});
});


module.exports = router;