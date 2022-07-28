const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"});
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({

    socialid:{
        type: String,
    },
    name:{
        type: String,
        default: "Marcus Henry"
    },
    mobile:{
        type: Number,
    },
    email:{
        type: String,
    },
    profile:{
        type: String,
    },
    usertype:{
        type: String
    },
    fcmtoken:{
        type: String,
        default: null
    },
    noofbooking:{
        type: Number,
        default: 0
    },
    noofownedgrounds:{
        type: Number,
        default: 0
    },
    createdat:{
        type: Date,
        default: new Date()
    },
    tokens: [{
        token: {
            type:String,
            required: true
        }
    }],
    status:{
        type: String
    }
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    user.status = "Active"
    await user.save()

    return token
}

const User = mongoose.model('User',userSchema)

module.exports = User
