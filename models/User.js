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
    tokens: [{
        token: {
            type:String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

const User = mongoose.model('User',userSchema)

module.exports = User
