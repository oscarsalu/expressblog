var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


/* GET home page. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var categories = db.get('categories');
    var posts = db.get('posts');
    posts.find({}, {}, function(err, posts, categories) {
        res.render('index', {
            "posts": posts,
            "categories": categories
        });
    });
});

module.exports = router;