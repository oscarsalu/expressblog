var express = require("express");
var router = express.Router();
var mongo = require("mongodb");
var db = require("monk")("localhost/nodeblog");
var multer = require("multer");
var upload = multer({
    dest: "./public/images/uploads/"
});

router.get('/show/:id', function(req, res, next) {
    var posts = db.get('posts');
    posts.findOne({ _id: req.params.id }, {}, function(err, posts) {
        res.render("show", {
            "post": posts
        });
    });
});


router.get('/add', function(req, res, next) {
    //get the collection i.e(table)
    var categories = db.get('categories');
    categories.find({}, {}, function(err, categories) {
        res.render("addpost", {
            "title": "Add Post",
            "categories": categories
        });
    });
});
router.post("/add", upload.single("mainimage"), function(req, res, next) {
    //get form values

    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = "OSK";
    var date = new Date();

    //for file upload
    if (req.file) {

        var mainImageOriginalName = req.file.originalname;
        var mainImageName = req.file.filename;
        var mainImageMime = req.file.mimetype;
        var mainImagePath = req.file.path
        var mainImageExt = req.file.encoding;
        var mainImageSize = req.file.size;
    } else {
        var mainImageName = 'noimage.png';
    }
    //form validation 
    req.checkBody('title', 'Title field is required').notEmpty();
    //req.checkBody('category', 'Category field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();

    //check errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('addpost', {
            "errors": errors,
            "title": title,
            "body": body
        });
    } else {
        //getting the collection i.e (table)
        var posts = db.get('posts');

        //submit
        posts.insert({
            "title": title,
            "body": body,
            "category": category,
            "date": date,
            "author": author,
            "mainimage": mainImageName
        }, function(err, post) {
            if (err) {
                res.send('There was an issue submitting the post,contact the admin');
            } else {
                req.flash('Success', 'Post Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }

});

module.exports = router;