//Loads the express module
const express = require("express");
const router = express.Router();

//Require bodyparser
const bodyParser = require("body-parser");

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Require validator for validating form data
const validator = require("validator");
const { Schedule } = require("../models/schedulesModel");

//Serves the body of the page aka "schedList.hbs" to the container "index.hbs"
router.get("/", (req, res) => {
  Schedule.getAllSchedules()
    .then((schedules) => {
      res.render("schedList", { layout: "index", schedules });
    })
    .catch((err) => {
      res.send("There was an error getting all schedules");
    });
});

router.get("/new", function (req, res) {
  res.render("schedForm", { layout: "index" });
});

router.post("/new", urlencodedParser, function (req, res) {
  //HTML time doesn't have seconds
  let seconds = ":00";
  let startTime = req.body.start_at.concat("", seconds);
  let endTime = req.body.end_at.concat("", seconds);

  // Need a Date Object to extract the day for DB table
  let date = new Date(Date.parse(req.body.day));

  //Pull the day from the date, add one due to zero-based indexing.
  let day = date.getDay() + 1;

  //Convert Date to ISOString and strip the time segment
  let dateString = date.toISOString().slice(0, 11).replace("T", " ");

  //concat the dateString with the startTime
  let startTimeISOString = dateString.concat("", startTime);

  //concat the dateString with the endTime
  let endTimeISOString = dateString.concat("", endTime);

  const records = [
    Number(req.body.user_id),
    day,
    startTimeISOString,
    endTimeISOString,
  ];

  Schedule.createANewSchedule(records)
    .then(() => {
      console.log("Schedule created successfully!");
      res.redirect("/schedules/new"); //Won't go to /schedules automatically
    })
    .catch((err) => {
      res.send("There was an error creating a new schedule");
    });
});

module.exports = router;
