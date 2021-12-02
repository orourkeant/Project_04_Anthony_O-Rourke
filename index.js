//Loads the express module
const express = require("express");

//Require .env
require("dotenv").config();

//Require bodyparser
const bodyParser = require("body-parser");

//Connect to r./routes/index.js
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const scheduleRouter = require("./routes/schedules");

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Creates our express server
const app = express();
const port = process.env.PORT;

//Loads the handlebars module
const handlebars = require("express-handlebars");
const router = require("./routes/users");

//app.enable('strict routing');

//Sets our app to use the handlebars engine
app.set("view engine", "hbs");

//Sets handlebars configurations
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "index",
    partialsDir: __dirname + "/views/partials/",
  })
);

//Serves static files (we need it to import a css file)
app.use(express.static("./public"));

app.use(urlencodedParser);

// Pull the routes from the ./routes/
app.use("/users", userRouter);
app.use("/", indexRouter);
app.use("/schedules", scheduleRouter);

//Makes the app listen to port 3000 as defined in .env file
app.listen(port, () => console.log(`App listening to port ${port}`));
