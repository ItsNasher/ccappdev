const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }
});

const tag = mongoose.model("tag", TagSchema);
module.exports = tag;