//Loads the express module
const express = require("express");
const router = express.Router();

//Require validator for validating form data
const validator = require("validator");

//Require the usersModel
const { User } = require("../models/usersModel");
//Require the crypto
const { Crypto } = require("../tools/encrypt");

router.get("/", async function (req, res) {
  //Runs the function in usersModel.js
  User.getAllUsers()
    .then((users) => {
      //Serves the body of the page aka "userList.hbs" to the container "index.hbs"
      res.render("userList", { layout: "index", users });
    })
    .catch((err) => {
      res.send("There was an error getting all users");
    });
});

router.get("/new", function (req, res) {
  res.render("userForm", { layout: "index" });
});

router.post("/new", function (req, res) {
  //Trim the input data
  let fName = validator.trim(req.body.firstname);
  let lName = validator.trim(req.body.lastname);
  let email = validator.trim(req.body.email);
  let pass = validator.trim(req.body.password);

  //handle the password encryption
  const encryptPassword = Crypto.hashThis(pass);

  //Escape the name inputs
  fName = validator.escape(fName);
  lName = validator.escape(lName);

  //If the email is valid, insert the new user to the DB
  if (validator.isEmail(email)) {
    console.log("Valid Email address!");
    //Create an array for inserting the variables to the query
    const records = [fName, lName, email, encryptPassword];

    User.createANewUser(records)
      .then(() => {
        console.log("User created successfully!");
        res.redirect("/users/new"); //Won't go to /users automatically
      })
      .catch((err) => {
        if (err.code === "ER_DUP_ENTRY") {
          res.send("email address already in use");
        } else {
          res.send("There was an error creating a new user");
        }
      });
  } else {
    console.log("Invalid Email address!");
    res.send("Invalid Email address!");
  }
});

// //Had to move the parameterised route underneath the new routes
// //Handle individual user routes if they exist, send error message if not...
router.get("/:userId", async function (req, res) {
  let ID = parseInt(req.params.userId);

  //Runs the function in usersModel.js
  User.getUsersByID(ID)
    .then((user) => {
      //Serves the body of the page aka "singleUser.hbs" to the container "index.hbs"
      res.render("singleUser", { layout: "index", user });
    })
    .catch((err) => {
      res.send("There was an error getting this user");
    });
});

router.get("/:userId/schedules", function (req, res) {
  let ID = parseInt(req.params.userId);
  User.getSchedulesForAUserByID(ID)
    .then((userSchedule) => {
      //Serves the body of the page aka "singleSched.hbs" to the container "index.hbs"
      res.render("singleSched", { layout: "index", userSchedule });
    })
    .catch((err) => {
      res.send("There was an error getting this user");
    });
});

module.exports = router;
