const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    purpose:{
        type:String,
        required:true
    }
});

const tokenModel = mongoose.model('Token', tokenSchema);

module.exports = tokenModel;