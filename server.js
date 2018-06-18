const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const session = require("express-session");
const flash = require('connect-flash');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Express-session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

app.use(flash());
// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});
  

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapingMongo");

// Routes
app.get('/', function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
        .then(function (dbArticles) {
            const hsbObject = {
                articles: dbArticles
            }
            // console.log(hsbObject);
            res.render('index', hsbObject);
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            console.log(err);
        });
});

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.echojs.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
            // Save an empty result object
            const result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

              // Create a new Article using the `result` object built from scraping
              db.Article.create(result)
                .then(function(dbArticle) {
                  // View the added result in the console
                  console.log(dbArticle);
                })
                .catch(function(err) {
                  // If an error occurred, send it to the client
                  console.log(err);
                });

        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        req.session.sessionFlash = {
            type: 'success',
            message: 'Scrape Successfully Completed.'
        }
        res.redirect("/");
    });
});



// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});