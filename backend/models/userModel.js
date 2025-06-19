const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    googleLogin:{
        type:Boolean,
        required:true
    }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;