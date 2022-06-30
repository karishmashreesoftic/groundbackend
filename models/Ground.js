const mongoose = require('mongoose');

const groundSchema = new mongoose.Schema({

    groundname:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    ownername:{
        type: String,
        required: true
    },
    starttime:{
        type: String,
        required: true
    },
    endtime:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    rating:{
        type: String,
        default: 0
    },
    photos: [{
        photoid:{
          type: String,
        },
        photourl:{
          type: String,
        },
        photothumbnail:{
          type: String,
        }
    }]
})

const Ground = mongoose.model('Ground',groundSchema)

module.exports = Ground