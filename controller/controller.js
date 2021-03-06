var express = require("express");
var router = express.Router();

//Require scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Import the model (article.js) to use its database functions
var db = require("../models/");

// Routes

//GET route for main display page
router.get("/", function(req, res) {
  res.redirect("/articles");
});

// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://medium.com/topic/technology").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // console.log(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    $("h3.ai.y.cl.bj.cm.bk.dx.fm.fn.ak.an.dz.cr.cs.am").each(function(
      i,
      element
    ) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      console.log(`title: ${result.title}`);
      result.link = $(this)
        .children("a")
        .attr("href");
      console.log(`link: ${result.link} + \n\n`);

      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(`+++++++++${dbArticle}`);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });
  res.send("scrape complete");
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find()
    .sort({ _id: -1 })
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        var hbsArticle = { article: doc };
        res.render("index", hbsArticle);
      }
      // db.Article.find({})
      //   .then(function(dbArticle) {
      //     // If we were able to successfully find Articles, send them back to the client
      //     res.json(dbArticle);
      //   })
      //   .catch(function(err) {
      //     // If an error occurred, send it to the client
      //     res.json(err);
      //   });
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("Comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Export routes for server.js
module.exports = router;
