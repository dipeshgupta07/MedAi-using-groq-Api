const mongoose = require("mongoose");


const message = new mongoose.Schema({
    message: {
        type: String,
    },
    sender: {
        type: String,
    },
    sessionId: {
        type: String,
    },
    created_at:{
        type: Date,
        required: true,
    },
});
const Chats = mongoose.model("Chats", message);
module.exports = Chats;