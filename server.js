const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const session = require("express-session");
const flash = require('connect-flash');
const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Require all models
const db = require("./models");

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
  
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapingMongo";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Home route
app.get('/', function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
        .populate("comments")
        .then(function (dbArticles) {
            const hsbObject = {
                articles: dbArticles
            }
            // res.json(hsbObject);
            // console.log(hsbObject);
            res.render('index', hsbObject);
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            console.log(err);
        });
});


// Route files
let scrape = require('./routes/scrape');
let articles = require('./routes/articles');
let comments = require('./routes/comments');
app.use(scrape);
app.use(articles);
app.use(comments);

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});