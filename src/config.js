const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/LogInPage");
const Tag = require("./tag");

// creates preset tags
async function addDefaultTags() {
    const tagsWithColors = [
        { name: 'News', color: '#ff5733' },
        { name: 'Tech', color: '#3498db' },
        { name: 'Sports', color: '#2ecc71' }, 
        { name: 'Gaming', color: '#9b59b6' } 
    ];

    for (let tag of tagsWithColors) {
        await Tag.updateOne(
            { name: tag.name },
            { $setOnInsert: { name: tag.name, color: tag.color } },
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
    },
    bio: {
        type: String,
        default: "Nothing to see here.."
    },
    posts: [{ type: Number, ref: "posts"}],
    comments: [{ type: Number, ref: "comments"}]
});

// schema for posts (no username and tags yet)
const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users",
        required: true 
    },
    postId: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
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
    commentId: {
        type: Number,
        required: true,
        unique: true
    },  
    postId: {
        type: Number,
        ref: 'posts',  //references to existing posts
        required: true
    },
    username: {
        type: String,
        required: true,
        default: "Username"
    },
    userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            require: true
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