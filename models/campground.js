var mongoose = require("mongoose");
 //    Comment = require("./comments");

// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    createAt: {type: Date, default: Date.now},
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ]
});


module.exports = mongoose.model("Campground", campgroundSchema);