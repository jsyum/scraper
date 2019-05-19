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
var db = require("./models/article.js");

//Require handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to Mongo DB
mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });
var dbconnect = mongoose.connection;
dbconnect.on("error", console.error.bind(console, "connection error:"));
dbconnect.once("open", function() {
  console.log("connected to mongoose");
});

//Define port and start Server
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`listening of PORT ${port}`);
});
