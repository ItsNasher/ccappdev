const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const { collection, postcollection, tag, mongoose} = require("./config"); // only works this way 
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

app.get("/home", (req, res) => { // the feed
    res.render("home");
});

app.get("/aboutus", (req, res) => {
    res.render("aboutus");
});

app.get("/createpost", (req, res) => {
    res.render("createpost");
});

app.get("/post", (req, res) => {
    res.render("post");
});

app.get("/profile", (req, res) => {
    res.render("profile");
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

// create post (no username and tags yet)
app.post("/createpost", upload.single("file"), async (req, res) => {
    console.log(req.body); 

    try {
        const { title, content_type, videoUrl } = req.body;
        let content = req.body.content || "";

        if (!title.trim()) {
            return res.json({ error: "Title is required!" });
        }

        if (content_type === "image" && req.file) {
            content = req.file.path;
        }

        if (content_type === "video" && videoUrl) {
            const youtubeMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
            if (!youtubeMatch) {
                return res.json({ error: "Invalid YouTube link!" });
            }
            content = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // auto incremented post id
        const lastPost = await postcollection.findOne().sort({ postId: -1 });
        const newPostId = lastPost ? lastPost.postId + 1 : 1;

        const newPost = new postcollection({
            postId: newPostId,
            title,
            content_type: content_type || "text",
            content
        });

        await newPost.save();

        res.json({ success: "Post created successfully!" });
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to create post!" });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})