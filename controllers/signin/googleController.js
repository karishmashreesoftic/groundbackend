const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})

const {OAuth2Client} = require('google-auth-library');
const User = require("../../models/User");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.authGoogle = async(req,res) => {
    try{

        const ticket = await client.verifyIdToken({
            idToken: req.params.idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        let user = await User.findOne({socialid : payload.sub, usertype: req.params.userType})

        if(!user){
            const data = {
                socialid : payload.sub,
                name : payload.name,
                email: payload.email,
                profile: payload.picture,
                usertype: req.params.userType
            }
            user = new User(data)
            await user.save()

            res.status(201).send({new:"true",user: user})
            
        }

        res.status(201).send({new:"false",user: user})

    }catch(error){
        res.send({error: error.message})
    }
}