const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    ground:{
        type: mongoose.Schema.Types.ObjectId, ref:'Ground'
    },
    userid:{
        type: mongoose.Schema.Types.ObjectId, ref:'User'
    },
    rate:{
        type: Number,
        required: true
    },
    review:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    time:{
        type: Date,
        default: new Date()
    }
})

const Review = mongoose.model('Review',reviewSchema)

module.exports = Review