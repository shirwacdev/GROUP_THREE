const mongoose = require('mongoose');

const uderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})