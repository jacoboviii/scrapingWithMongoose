const express = require('express');
const router = express.Router();

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("../models");

// A GET route for scraping the elpais website
router.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://elpais.com/elpais/portada_america.html").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".articulo__interior").each(function (i, element) {
            // Save an empty result object
            const result = {};
            let link;

            // Add the title, href, image source and author of every article, and save them as properties of the result object
            result.image = $(element)
                .children(".foto")
                .children("a")
                .children("meta[itemprop=url]")
                .attr("content");
            result.title = $(element)
                .children(".articulo-titulo")
                .children("a")
                .text();
            link = $(element)
                .children(".articulo-titulo")
                .children("a")
                .attr("href");

            // Check link format
            if(link.includes("http")){
                result.link = link
            } else {
                result.link = "https://elpais.com" + link
            }

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

// Export routes for server.js to use.
module.exports = router;