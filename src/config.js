const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/LogInPage");


//checking connection
connect.then(() => {
    console.log("Database connected Successfully!");
})
.catch(() => {
    console.log("Database cannot be connected.");
})

//creating a schema

const LoginSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// schema for posts (no username and tags yet)
const PostSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    date_posted: { 
        type: Date, 
        default: Date.now 
    },
    content_type: { 
        type: String, 
        enum: ["text", "image", "video", "link"],
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    } // stores text, file path, or URL
});

// schema for the tags
const TagSchema = new mongoose.Schema({
    name: { 
        type: String, 
        unique: true, 
        required: true 
    }
});


//collection port
const collection = new mongoose.model("users", LoginSchema);
const postcollection = mongoose.model("posts", PostSchema);
const tag = mongoose.model("tags", TagSchema);

module.exports = { collection, postcollection, tag, mongoose};
