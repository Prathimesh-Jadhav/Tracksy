const mongoose = require('mongoose')

const salesSchema = new mongoose.Schema({
    saleID: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    soldProducts: {
        type: [Object],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    associatedOwner: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

const salesModel = mongoose.model('Sales', salesSchema)

module.exports = salesModel