const express = require('express');
const router = express.Router();

// Require all models
const db = require("../models");

router.post("/articles/:id", function(req, res) {
    // save the new comment that gets posted to the comments collection
    // then find an article from the req.params.id
    // and update it's "comment" property with the _id of the new comment
    db.Comment.create(req.body)
    .then(function(dbComment){
      return db.Article.findOneAndUpdate({_id : req.params.id}, {$push: {comments: dbComment._id}}, {new : true});
      })
    .then(function(){
        req.session.sessionFlash = {
            type: 'success',
            message: 'Comment Added.'
        }
        res.redirect("/");
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      console.log(err);
    });
  });

// Delete route to delete a single articles
router.delete("/articles/:id", function(req, res){
    db.Article.remove({ _id: req.params.id})
    .then(function(){
        req.session.sessionFlash = {
            type: 'success',
            message: 'Article Deleted.'
        }
        res.send('/')
    })
    .catch(function(err){
        console.log(err)
    });
});

// Export routes for server.js to use.
module.exports = router;