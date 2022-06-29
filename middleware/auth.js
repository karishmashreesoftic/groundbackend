const jwt = require('jsonwebtoken');
const User = require("../models/User")
const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})


exports.auth = async (req, res, next) => {
    try{

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user;
        user = await User.findOne({_id:decoded._id, 'tokens.token': token})
        if(!user){
            user = await Member.findOne({_id:decoded._id, 'tokens.token': token})
            if(!user){
                throw new Error()
            }
        }

        req.token = token
        req.user = user
        
        next()
        
    }catch(e){
        res.status(401).send({error: "Please authenticate...!!!"})
    }
}