const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://yosh:DLSU1234!@loginpage.w8oya.mongodb.net/LogInPage");


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

//collection port
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;

