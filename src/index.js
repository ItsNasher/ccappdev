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

//Register User
app.post("/register", async (req, res) => {

    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    const userdata = await collection.insertMany(data);
    console.log(userdata);
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})