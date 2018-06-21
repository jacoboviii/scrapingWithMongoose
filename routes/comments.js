const express = require('express');
const router = express.Router();

// Require all models
const db = require("../models");

// Delete route to delete a single comment
router.delete("/comments/:id", function(req, res){
    db.Comment.remove({ _id: req.params.id})
    .then(function(){
        req.session.sessionFlash = {
            type: 'success',
            message: 'Comment Deleted.'
        }
        res.send('/')
    })
    .catch(function(err){
        console.log(err)
    });
});

// Export routes for server.js to use.
module.exports = router;