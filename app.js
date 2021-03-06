require('dotenv').config();

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    moment     = require("moment"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    flash       = require("connect-flash"),
    methodOverride = require("method-override"),  //  Built-in methods for EDIT & UPDATE routes
    User        = require("./models/user"),
    seedDB      = require("./seeds");  // function for manualy seeding database
    
// requring routes    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes  = require("./routes/index");

//  call seedDB() function for seeding database    
//  seedDB(); 
    
// mongoose.connect("mongodb://localhost/yelp_camp_v12", { useNewUrlParser: true });   // connecting to DB
   mongoose.connect(process.env.YELP_CAMP_DATABASE, {
       useNewUrlParser: true,
       useCreateIndex: true
   }).then(() => {
       console.log('Connected to DB!');
   }).catch(err => {
       console.log('ERROR', err.message);
   });

app.use(bodyParser.urlencoded({extended: true}));  //  use Body-parser for getting data from the req.body
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));  // use public directiory 
app.use(methodOverride("_method"));  //  use methodOverride libreries for EDIT & UPDATE routes
app.use(flash());  // use flash() built-in methods for flash messages in my application

app.locals.moment = require('moment');
// PASSPORT configuration
app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   // build-in methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  assign currentUser object to all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//  import all routes files
app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(authRoutes);

/*
   Routes construction pattern

name          url                verb        desc.Accounts

======================================================================================
INDEX        /campdrounds        GET        Display a list of all campgrounds
NEW          /campgrounds/new    GET        Display form to make a new campground
CREATE       /campdrounds        POST       Add a new campground in DB
SHOW         /campdrounds/:id    GET        Show description about one campdround
UPDATE      / campdrounds/:id    POST       Find camground by ID and update
DESTROY     / campdrounds/:id    DELETE     Find camground by ID and delete
*/

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp server has started!!!");
});