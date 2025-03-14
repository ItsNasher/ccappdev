const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/");


//checking connection
connect.then(() => {
    console.log("Database connected Successfully!");
})
.catch(() => {
    console.log("Database cannot be connected.");
})

//creating a schema

const LoginSchema  = new mongoose.Schema({
    namme: {
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

