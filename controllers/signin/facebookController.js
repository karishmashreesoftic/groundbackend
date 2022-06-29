const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})

const User = require("../../models/User");

exports.authFacebook = async(req,res) => {
    try {
    
        const status = response.status;
        const t = await response.json();
        setcurrentUser(t.user)

        const result = appleSignin.verifyIdToken(req.params.idToken, process.env.APPLE_CLIENT_ID)
        console.log(result)
        const user = await User.findOne({socialid: result.sub})

        if(!user){
            const data = {
                socialid: result.sub,
                name: result.name,
                email: result.email,
                profile: result.picture,
                usertype: req.params.userType
            }
            const newUser = new User(data)
            await newUser.save()

            res.status(201).send({userstatus: "authenticated", user: newUser})
            
        }else{
            res.status(201).send({userstatus: "authenticated", user: user})
        }
        
    } catch (error) {
        res.status(201).status({error: error.message});
    }
}