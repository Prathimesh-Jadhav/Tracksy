const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId:{
        type: String,
        required: true
    },
    productName:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    items: {
        type: Number,
        required: true
    },
    costPrice: {
        type: Number,
        required: true
    },
    sellingPrice:{
        type: Number,
        required: true
    },
    image:{
        type: String,
    },
    icon:{
        type: String,
    },
    associatedOwner:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);