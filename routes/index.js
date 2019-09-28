var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//  Root route
router.get("/", function(req, res) {
    res.render("campgrounds/landing");
});

// ===============================
//   AUTHORIZATION Routes
// ===============================


// Show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

//  handle Sign Up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
          console.log(err);
          return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//  Show login form

router.get("/login", function(req, res) {
    
    res.render("login", {page: 'login'});
});

//  handling login logic:  app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }
), function(req, res) {
   // No need callback in this case
     
});

//   Logout route

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

// check if the user is Logged in


module.exports = router;