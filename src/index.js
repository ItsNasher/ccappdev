const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const { collection, commentcollection, postcollection, mongoose} = require("./config"); // only works this way 
const tag =  require("./tag");
const upload = require("./fileupload"); 

const app = express();

// uploaded files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"))); 

//covernting data to json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

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
        const posts = await postcollection.find().sort({ postId: 1 });
        const fetchedTags = await tag.find({}, "name color");
        res.render("home", { posts, fetchedTags }); 
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

        res.render("post", { post, comments, fetchedTags }); 

    } catch (error) {
        console.error(error);
    }
});

app.get("/profile", (req, res) => {
    res.render("profile");
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

// create post (no username yet)
app.post("/createpost", upload.single("file"), async (req, res) => {
    console.log("Received data:", req.body);

    try {
        const { title, content_type, videoUrl } = req.body;
        let content = req.body.content || "";
        let parsedTags = [];

        if (!title.trim()) {
            return res.json({ error: "Title is required!" });
        }

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
            postId: newPostId,
            title,
            content_type: content_type || "text",
            content,
            tags: tagNames
        });

        await newPost.save();

        res.json({ success: "Post created successfully!" });
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to create post!" });
    }
});

//create comment 

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})