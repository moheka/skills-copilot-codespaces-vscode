// Create web server
// Run: node comments.js
// Test: curl http://localhost:3000/comments

// Load the express module
var express = require('express');
var app = express();

// Load the body-parser module
var bodyParser = require('body-parser');

// Load the mongoose module
var mongoose = require('mongoose');

// Connect to the localhost MongoDB database
mongoose.connect('mongodb://localhost/comment');

// Create a schema
var commentSchema = mongoose.Schema({
    name: String,
    comment: String
});

// Create a model based on the schema
var Comment = mongoose.model('Comment', commentSchema);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Allow the app to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Allow the app to parse application/json
app.use(bodyParser.json());

// Get all comments
app.get('/comments', function(req, res) {
    Comment.find(function(err, comments) {
        if (err) {
            res.send(err);
        }
        res.json(comments);
    });
});

// Create a comment
app.post('/comments', function(req, res) {
    Comment.create({
        name: req.body.name,
        comment: req.body.comment
    }, function(err, comment) {
        if (err) {
            res.send(err);
        }
        Comment.find(function(err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    });
});

// Delete a comment
app.delete('/comments/:comment_id', function(req, res) {
    Comment.remove({
        _id: req.params.comment_id
    }, function(err, comment) {
        if (err) {
            res.send(err);
        }
        Comment.find(function(err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    });
});

// Start the server
app.listen(3000, function() {
    console.log('Server is running on port 3000');
});