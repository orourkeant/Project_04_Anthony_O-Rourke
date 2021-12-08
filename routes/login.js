//Loads the express module
const express = require('express');
const router = express.Router();

//Require the loginModel
const { Login } = require("../models/loginModel");
//Require the crypto tool
const {Crypto} = require("../tools/encrypt");

let loggedIn = false;

router.get('/', function(req, res){
    res.render('loginForm', {layout: 'index'});
});

router.post('/', async function(req, res){
    
    const loginPass = Crypto.hashThis(req.body.pass);
    
    // await the DB call to get the password associated with the entered email address
    const dbPass = await Login.getPassByEmail(req.body.email)
        .then((passObj) => {
            console.log('DB Password: ', passObj[0].password);
            return passObj[0].password;
        })
        .catch((err) =>{
            console.log("Error in getPassByEmail: ", err);
        }); 
    
    // Compare the hashed login form password with the one from the DB.
    
    if(dbPass === loginPass){
        loggedIn = true;
        //set a jwt token for this user

    }

    console.log('Email: ', req.body.email);
    console.log('Login Password: ', req.body.pass);
    console.log('Encrypted Password: ', Crypto.hashThis(req.body.pass));
    console.log('Logged in? ', loggedIn);   

    // redirect to the login get until connected to DB
    res.redirect('/login');

});

module.exports = router;