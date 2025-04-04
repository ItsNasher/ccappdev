const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const { collection, commentcollection, postcollection, mongoose} = require("./config"); // only works this way 
const tag =  require("./tag");
const upload = require("./fileupload"); 
const session = require('express-session');
const store = require('connect-mongo');

const app = express();

// uploaded files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"))); 

//covernting data to json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

// for sessions
app.use(session({
    secret: '3IkCoVO8Cr', // secret key
    resave: false,
    saveUninitialized: false,
    store: store.create({
        mongoUrl: 'mongodb://localhost:27017/LogInPage',
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60, // 14 day expiration
    }),
    cookie: { secure: false }
}));

//function to see if someones logged in
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/");
    }
    next();
}

//EJS as view engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '..', 'views')); 

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/home", async (req, res) => { // the feed of the forum
    try {
        const posts = await postcollection.find().sort({ postId: -1 });
        const fetchedTags = await tag.find({}, "name color");
        res.render("home", { posts, fetchedTags, user: req.session.user || { name: "Guest" } }); 
    } catch (error) {
        console.error(error);
        res.render("home", { posts: [], fetchedTags: []  });
    }
});

app.get("/aboutus", (req, res) => {
    res.render("aboutus");
});

app.get("/createpost", async (req, res) => {
    try {
        const tags = await tag.find({}, "name color");
        res.render("createpost", { tags }); 
    } catch (err) {
        console.error(err);
        res.render("createpost", { tags: [] }); 
    }
});

app.get("/post/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;

        //get post details
        const post = await postcollection.findOne({ postId });

        if (!post) {
            return res.json({ error: "Post not found!" })
        }
        //get comments related to the post
        const comments = await commentcollection.find({ postId });

        const fetchedTags = await tag.find({}, "name color");

        res.render("post", { post, comments, fetchedTags, user: req.session.user || { name: "Guest" } }); 

    } catch (error) {
        console.error(error);
    }
});

app.get("/profile", async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await collection.findOne({ _id: userId });

        if (!user) {
            return res.status(404).render("error", { message: "User not found!" });
        }

        const userPosts = await postcollection.find({ postId: { $in: user.posts } });
        const userComments = await commentcollection.find({ userId });
        const fetchedTags = await tag.find({}, "name color");

        res.render("profile", { 
            user: { 
                _id: user._id, 
                name: user.name, 
                bio: user.bio 
            }, 
            posts: userPosts, 
            comments: userComments,
            fetchedTags,
            req: req 
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", { message: "Failed to fetch profile data!" });
    }
});

// logs out
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error :", err);
            return res.status(500).json({ error: "Logout failed." });
        }
        res.redirect("/");
    });
});

// const tagNames = tags.map(t => t.name);
// gets all the tags
app.get("/savetags", async (req, res) => {
    try {
        const tags = await tag.find({}, "name color");
        res.json(tags);
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({ error: "Failed to fetch tags" });
    }
});

// click on a users post
app.get("/profile/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await collection.findOne({ _id: new mongoose.Types.ObjectId(userId) });

        if (!user) {
            return res.status(404).render("error", { message: "User not found!" });
        }

        const userPosts = await postcollection.find({ userId: user._id });
        const userComments = await commentcollection.find({ userId: user._id });
        const fetchedTags = await tag.find({}, "name color");

        res.render("profile", { 
            user: { 
                _id: user._id, 
                name: user.name, 
                bio: user.bio 
            }, 
            posts: userPosts, 
            comments: userComments,
            fetchedTags,
            req: req
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", { message: "Failed to fetch profile data!" });
    }
});

//register User
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.json({ error: "All fields are required!" });
        }

        const existingUser = await collection.findOne({ name: username });
        if (existingUser) {
            return res.json({ error: "User already exists!" });
        }

        const existingEmail = await collection.findOne({ email });
        if (existingEmail) {
            return res.json({ error: "Email is already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await collection.create({ name: username, email, password: hashedPassword });

        res.json({ success: "Registration successful! Redirecting to login..." });
    } catch (err) {
        console.error(err);
        res.json({ error: "Something went wrong. Try again!" });
    }
});

// login
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });

        if (!check) {
            return res.json({ error: "Username not found!" });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

        if (!isPasswordMatch) {
            return res.json({ error: "Wrong Password!" });
        }

        req.session.user = { _id: check._id, name: check.name, bio: check.bio };

        res.json({ success: "Login successful! Welcome to CHAT!" });
    } catch (err) {
        console.error(err);
        res.json({ error: "An error occurred. Please try again!" });
    }
});

//saves tags
app.post("/savetags", async (req, res) => {
    try {
        let { tags } = req.body;

        if (typeof tags === "string") {
            try {
                tags = JSON.parse(tags);
            } catch (error) {
                return res.status(400).json({ error: "Invalid tags format!" });
            }
        }

        if (!Array.isArray(tags)) {
            return res.status(400).json({ error: "Tags should be an array!" });
        }

        const tagColors = ["#5271ff", "#ff5733", "#33ff57", "#f1c40f", "#9b59b6", "#e74c3c", "#3498db"];

        const existingTags = await tag.find({ name: { $in: tags } });
        const existingTagNames = existingTags.map(t => t.name);

        const newTags = tags.filter(t => !existingTagNames.includes(t));

        const tagCount = await tag.countDocuments();

        const newTagObjects = newTags.map((tagName, index) => ({
            name: tagName,
            color: tagColors[(tagCount + index) % tagColors.length] 
        }));

        if (newTagObjects.length > 0) {
            await tag.insertMany(newTagObjects);
        }

        const allTags = await tag.find({ name: { $in: tags } });

        res.json({ success: "Tags saved successfully", savedTags: allTags });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save tags" });
    }
});

// create post
app.post("/createpost", upload.single("file"), async (req, res) => {
    console.log("Received data:", req.body);

    try {
        const { title, content_type, videoUrl } = req.body;
        let content = req.body.content || "";
        let parsedTags = [];

        if (!title.trim()) {
            return res.json({ error: "Title is required!" });
        }

        if (!req.session.user) {
            return res.json({ error: "User not logged in!" });
        }

        const username = req.session.user.name;
        const userId = req.session.user._id;

        if (Array.isArray(req.body.tags)) {
            req.body.tags = req.body.tags.filter(tag => tag !== "[]");
        }

        const tagsString = req.body.tags.length > 0 ? req.body.tags[0] : "[]";
        parsedTags = JSON.parse(tagsString);

        if (!Array.isArray(parsedTags)) {
            return res.json({ error: "Tags must be an array!" });
        }

        console.log("Parsed Tags:", parsedTags);

        const tagNames = parsedTags;

        console.log("Tag Names:", tagNames);

        if (content_type === "image" && req.file) {
            content = req.file.filename;
        } 

        if (content_type === "video" && videoUrl) {
            const youtubeMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
            if (!youtubeMatch) {
                return res.json({ error: "Invalid YouTube link!" });
            }
            content = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // post id in descending order (first post to last post might add button for this)
        const lastPost = await postcollection.findOne().sort({ postId: -1 });
        const newPostId = lastPost ? lastPost.postId + 1 : 1;

        const newPost = new postcollection({
            userId,
            postId: newPostId,
            title,
            content_type: content_type || "text",
            content,
            tags: tagNames,
            username
        });

        await newPost.save();

        await collection.updateOne(
            { _id: userId },
            { $push: { posts: newPostId } }
        );
        res.json({ success: "Post created successfully!", postId: newPostId });
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to create post!" });
    }
});

//edit post
app.post("/editpost", async (req, res) => {
    try {
        const { postId, newTitle, newContent } = req.body;
        const username = req.session.user.name;

        const post = await postcollection.findOne({ postId: Number(postId) });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.username !== username) {
            return res.status(403).json({ error: "You can only edit your own posts" });
        }

        if (!newTitle || newTitle.trim() === "") {
            return res.status(400).json({ error: "Post title cannot be empty" });
        }

        if (!newContent || newContent.trim() === "") {
            return res.status(400).json({ error: "Post content cannot be empty" });
        }

        const updatedPost = await postcollection.findOneAndUpdate(
            { postId: Number(postId) },
            { 
                title: newTitle,
                content: newContent,
                date_posted: new Date() 
            },
            { new: true }
        );

        res.json({ 
            success: "Edited the post successfully", 
            post: updatedPost 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to edit post" });
    }
});

//delete post
app.post("/deletepost", async (req, res) => {
    try {
        const { postId } = req.body;
        const username = req.session.user.name;

        const post = await postcollection.findOne({ postId: Number(postId) });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.username !== username) {
            return res.status(403).json({ error: "You can only delete your own posts" });
        }

        //delete comments under post (useless data) then the post itself
        await commentcollection.deleteMany({ postId: Number(postId) });
        await postcollection.findOneAndDelete({ postId: Number(postId) });

        res.json({ 
            success: "Post and comments deleted successfully",
            redirectUrl: "/home"
        });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete post" });
    }
});

//create comment 
app.post("/createcomment", async (req, res) => {
    try {
        const { postId, username, text } = req.body; 

        if (!req.session.user) {
                    return res.json({ error: "User not logged in!" });
        }

        const lastComment = await commentcollection.findOne().sort({ commentId: -1 });
        const newCommentId = lastComment ? Number(lastComment.commentId) + 1 : 1;

        const userId = req.session.user._id;

        const newComment = new commentcollection({
            commentId: newCommentId,
            postId,
            username,
            userId,
            text,
            date_posted: new Date()
        });

        await collection.updateOne(
            { _id: userId },
            { $push: { comments: newCommentId } }
        );

        await newComment.save();
        res.json({ success: "Comment created!" });
    } 
    
    catch (err) {
        console.error(err);
        res.json({ error: "Something went wrong. Try again!" });
    }
});

//edit comment
app.post("/editcomment", async (req, res) => {
    try {
        const { commentId, newText } = req.body;
        const username = req.session.user.name;

        const comment = await commentcollection.findOne({ commentId: Number(commentId) });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.username !== username) {
            return res.status(403).json({ error: "You can only edit your own comments" });
        }

        if (!newText || newText.trim() === "") {
            return res.status(400).json({ error: "Comment text cannot be empty" });
        }

        const updatedComment = await commentcollection.findOneAndUpdate(
            { commentId: Number(commentId) },
            { text: newText, date_posted: new Date() },
            { new: true }
        );

        res.json({ success: "Comment edited successfully", comment: updatedComment });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to edit comment" });
    }
});

//delete comment 
app.post("/deletecomment", async (req, res) => {
    try {
        const { commentId } = req.body;
        const username = req.session.user.name;

        const comment = await commentcollection.findOne({ commentId: Number(commentId) });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.username !== username) {
            return res.status(403).json({ error: "You can only delete your own comments" });
        }

        await commentcollection.findOneAndDelete({ commentId: Number(commentId) });

        res.json({ success: "Comment deleted successfully" });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete comment" });
    }
});

//update profile
app.post("/updateProfile", async (req, res) => {
    try {
        const { username, bio } = req.body;

        if (!req.session.user) {
            return res.json({ error: "User not logged in!" });
        }

        const userId = req.session.user._id;

        await collection.updateOne(
            { _id: userId },
            { $set: { name: username, bio } }
        );

        req.session.user.name = username;
        req.session.user.bio = bio;

        res.json({ success: "Profile updated successfully!" });
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to update profile!" });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})