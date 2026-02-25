const mongoose = require('mongoose');

const TeacherUserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    address:{
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})


exports.model = mongoose.model("TeacherUser", TeacherUserSchema)