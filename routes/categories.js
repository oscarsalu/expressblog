var express = require("express");
var router = express.Router();
var mongo = require("mongodb");
var db = require("monk")("localhost/nodeblog");

router.get("/show/:category", function(req, res, next) {
    var db = req.db;
    var posts = db.get('posts');
    posts.find({
        category: req.params.category
    }, {}, function(err, posts) {
        res.render("index", {
            "title": req.params.category,
            "posts": posts
        });
    });
});

/* GET home page. */
router.get("/add", function(req, res, next) {
    res.render("addcategory", {
        "title": "Add category"
    });
});
router.post("/add", function(req, res, next) {
    //get form values

    var title = req.body.title;


    //form validation
    req.checkBody("title", "Title field is required").notEmpty();

    //check errors
    var errors = req.validationErrors();

    if (errors) {
        res.render("addpost", {
            errors: errors,
            title: title

        });
    } else {
        //getting the collection i.e (table)
        var categories = db.get("categories");

        //submit
        categories.insert({
                title: title
            },
            function(err, post) {
                if (err) {
                    res.send("There was an issue submitting the Category,contact the admin");
                } else {
                    req.flash("Success", "Category Submitted");
                    res.location("/");
                    res.redirect("/");
                }
            }
        );
    }
});


module.exports = router;