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

//Register User
app.post("/register", async (req, res) => {

    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    //check if the username already exists in hte database
    const existingUser = await collection.findOne({name: data.name});

        //check if the email already exists in hte database
        const existingEmail = await collection.findOne({email: data.email});

    if(existingUser){
        res.send("User already exists. Please choose a different username.");
    } 
    
    else if(existingEmail){
        res.send("Account with email already exists.");
    } 
    
    else {
        //hasing the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        
        data.password = hashedPassword;
        
        const userdata = await collection.create(data);
        console.log(userdata);
    }

})

//Log in user
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("Username cannot be found.")
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

        if (!isPasswordMatch) {
            return res.send("Wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("Wrong Details");
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})