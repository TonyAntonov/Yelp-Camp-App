
require('dotenv').config();

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
 cloudinary.config({
     cloud_name: 'litex',
     api_key:  process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
 });


// Index route - show all campgrounds
 
router.get("/campgrounds", function(req, res) {
    
// Get all campgrouds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            console.log(process.env.CLOUDINARY_API_KEY)
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: 'campgrounds'});
        }
    });
});

//Create a new post route
router.post("/campgrounds", middleware.isLoggedIn, upload.single('image'), function(req, res) {

cloudinary.uploader.upload(req.file.path, function(result) {
      // add cloudinary url for the image to the campground object under image property
     console.log("This is a " + result);
      req.body.campground.image = result.secure_url;
      
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      };
      Campground.create(req.body.campground, function(err, campground) {
        if (err) {
            console.log(err);
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
      });
    });
});
//  NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/newcampground");
});

//   SHOW - shows more info about one campgrount

router.get("/campgrounds/:id", function(req, res) {
  // Find the Campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgroung){
      if(err) {
          console.log(err);
      } else {
     
     if (!foundCampgroung) {
                return res.status(400).send("Item not found.");
            }
// render show template with the Campground
         res.render('campgrounds/show', {campground: foundCampgroung});
      }
   });
 }); 
 
// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
            Campground.findById(req.params.id, function(err, foundCampground) {
        
        if (!foundCampground) {
            return res.status(400).send("Item not found.");
        }
               res.render("campgrounds/edit", {campground: foundCampground});
        }); 

});
// UPDATE CAMPGROUND ROUTE
   router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
       // find and update the correct campground
       Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
           if(err) {
               res.redirect("/campgrounds");
           } else {
               res.redirect("/campgrounds/" + req.params.id);
           }
       });
   });
   
//  DESTROY Campgrount Route
 router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
     Campground.findByIdAndRemove(req.params.id, function(err) {
         if(err) {
             res.redirect("/campgrounds");
         } else {
             res.redirect("/campgrounds");
         }
     });
 });


module.exports = router;