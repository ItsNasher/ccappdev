const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/LogInPage");
const Tag = require("./tag");

// Creates default tags
async function addDefaultTags() {
    const tags = ['News', 'Tech', 'Sports', 'Gaming'];
  
    for (let tag of tags) {
      await Tag.updateOne(
        { name: tag }, 
        { $setOnInsert: { name: tag } }, 
        { upsert: true } 
      );
    }
}


//checking connection
connect.then(() => {
    console.log("Database connected Successfully!");

    addDefaultTags()
})
.catch(() => {
    console.log("Database cannot be connected.");
})

//creating the schemas

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
    postId: {
        type: Number,
        required: true,
        unique: true
    },
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
    tags: [{
        type: String
    }],
    content: { 
        type: String, 
        required: true 
    } // stores text, file path, or URL
});

//schema for comments (no user)
const CommentSchema = new mongoose.Schema({
    postId: {
        type: Number,
        ref: 'posts',  //references to existing posts
        required: true
    },
    username: {
        type: String,
        required: true,
        default: "RandomUsername"
    },
    text: {
        type: String,
        required: true
    },
    date_posted: {
        type: Date,
        default: Date.now
    }
});


//collection port
const collection = new mongoose.model("users", LoginSchema);
const postcollection = mongoose.model("posts", PostSchema);
const commentcollection = mongoose.model("comments", CommentSchema)

module.exports = { collection, postcollection, commentcollection, mongoose};