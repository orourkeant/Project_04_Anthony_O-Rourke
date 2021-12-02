//Loads the express module
const express = require("express");
const router = express.Router();

// Get connection from here until all queries moved to /models
const connection = require("../models/DBSetup");

//Require the usersModel
const { User } = require("../models/usersModel");

//Require validator for validating form data
const validator = require("validator");

router.get("/", async function(req, res) {
  //Runs the function in usersModel.js
  User.getAllUsers().then((users) => {
    console.log("Blah!", users);
    //Serves the body of the page aka "userList.hbs" to the container "index.hbs"
    res.render("userList", { layout: "index", users });
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
  const crypto = require("crypto");
  const encryptPassword = crypto
    .createHash("sha256")
    .update(pass)
    .digest("base64");

  //Escape the name inputs
  fName = validator.escape(fName);
  lName = validator.escape(lName);

  //If the email is valid, insert the new user to the DB
  if (validator.isEmail(email)) {
    //Create an array for inserting the variables to the query
    const records = [fName, lName, email, encryptPassword];
    connection.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES (?);",
      [records],
      (err, rows) => {
        if (err) throw err;
        console.log(rows);
      }
    );
  }

  //Redirect back to the get route
  res.redirect("/new");
});
// //Had to move the parameterised route underneath the new routes
// //Handle individual user routes if they exist, send error message if not...
router.get("/:userId", function (req, res) {
  let ID = parseInt(req.params.userId);

  connection.query(
    "SELECT first_name, last_name, email, password FROM users WHERE id = ?;",
    ID,
    (err, rows) => {
      if (err) throw err;
      res.render("singleUser", { layout: "index", rows });
    }
  );
});

router.get("/:userId/schedules", function (req, res) {
  let ID = parseInt(req.params.userId);

  connection.query(
    "SELECT user_id, day, start_time, end_time FROM schedules WHERE user_id = ?;",
    ID,
    (err, rows) => {
      if (err) throw err;
      //Using the index.hbs file
      console.log(rows);
      res.render("singleSched", { layout: "index", rows });
    }
  );
});

module.exports = router;
