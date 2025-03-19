const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config")

const app = express();

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

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})