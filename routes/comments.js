var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware/index");

// Comments new route

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
//   Find Campground by ID    
  Campground.findById(req.params.id, function(err, campground) {
      if(err) {
          console.log(err);
      } else {
           res.render("comments/new", {campground: campground});
      }
  });  
});

// Comments Create route

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
//  Lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
      if(err) {
          console.log(err);
      } else {
//  Create new comment
      Comment.create(req.body.comment, function(err, comment) {
          if(err) {
              console.log(err);
          } else {
//add username and id to comment   
         comment.author.id = req.user._id;
         comment.author.username = req.user.username;
         comment.save();
    //   connect the new comment to campground
          campground.comments.push(comment);
          campground.save();
   //   Redirect
       res.redirect("/campgrounds/" + campground._id);
          }
      });
      }
  });
});

//   EDIT route for comments - Show Edit comment form

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            console.log("This is  a comment " + foundComment);
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//   UPDATE route for comments

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE comment route

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;