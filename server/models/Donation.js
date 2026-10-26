
const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema({

    organizationName: {
        type: String,
        required: true,
        trim: true
    },

    contactNumber: {
        type: String,
        required: true,
        trim: true
    },

    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    foodName: {
        type: String,
        required: true,
        trim: true
    },
    foodType: {
        type: String,
        enum: ['Veg', 'Non-Veg'],
        required: true
    },
    foodImage: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        required: true,
        min: 0.1
    },
    unit: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    expiryTime: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Donation', donationSchema)
