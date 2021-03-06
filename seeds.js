var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comments");
    
    var seeds = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff77",
            username: "Jane"
        }
    }
];
        
// async DB seeding function
async function seedDB() {
   try {
       await Campground.remove({}); 
//   console.log('campgrounds removed');
  
      await Comment.remove({});
//   console.log('commets removed');
   
      for(const seed of seeds) {
         let campground = await Campground.create(seed);
//       console.log('Campground has been created');
         let comment = await Comment.create(
                {
                    text: 'Good plase, but it would be better if there was internet',
                    author: 'Patrick Jones' 
                }
            );
//            console.log('Comment has been created');
            campground.comments.push(comment);
            campground.save();
          }
     } catch(err) {
        console.log(err);
       } 
    
 
/*    
//  Remove all comments
    Comment.remove({}, function(err) {
        if(err){
            console.log(err);
        } 
        console.log('removed comments');
        
    //  Remove all campgrounds
    Campground.remove({}, function(err) {
       if(err){
            console.log(err);
        } else {
   console.log("All campgrounds have been removed!");
  //  Add a few campground
   data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
            if(err){
                console.log(err);
            } else {
                 console.log("Added a campground");
  //   Add a few comments
            Comment.create(
                {
                    text: "Good plase, but it would be better if there was internet",
                    author: "Tony Antonov" 
                }, function(err, comment) {
                    if(err){
                        console.log(err);
                    } else {
                        campground.comments.push(comment);
                        campground.save();
                        console.log("one comment has been pushed");
                    }
                });
            }
        });
      }); 
    }
   });     
 });
 */
}

module.exports = seedDB;