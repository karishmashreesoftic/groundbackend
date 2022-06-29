const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const User = require("../../models/User")

exports.sendOTP = async(req,res) => {

    try{
        const otp = await client.verify.services(process.env.TWILIO_SERVICE).verifications.create({to: req.body.mobile, channel: 'sms'})
        res.status(200).send("OK")
    }catch(error){
        res.send({error: error.message})
    }

}   

exports.verifyOTP = async(req,res) => {

    try{
        const otp = await client.verify.services(process.env.TWILIO_SERVICE).verificationChecks.create({to: req.body.mobile, code: req.body.otp})
        let user;
        let token;
        if(otp.status==="approved"){
            user = await User.findOne({mobile: String(req.body.mobile).substring(1,13), usertype: req.params.userType})
            if(!user){
                user = new User({mobile: req.body.mobile, usertype: req.params.userType})
                await user.save()
                token = await user.generateAuthToken()
                res.status(201).send({new:"true",user: user})
            }
                
            token = await user.generateAuthToken() 
            res.status(201).send({new:"false",user: user})

        }else{
            res.status(401).send()
        }
    }catch(error){
        res.send({error:error.message})
    }

}   
