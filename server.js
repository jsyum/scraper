//Require dependencies
var express = require("express");
var mongoose = require("mongoose");

//initialize express
var app = express();

// Configure middleware
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Require models
// var db = require("./models");

//Require handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to Mongo DB

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });
var dbconnect = mongoose.connection;
dbconnect.on("error", console.error.bind(console, "connection error:"));
dbconnect.once("open", function() {
  console.log("connected to mongoose");
});

// require routes
var routes = require("./controller/controller");
app.use(routes);
app.use("/", routes);

//Define port and start Server
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`listening of PORT ${port}`);
});
