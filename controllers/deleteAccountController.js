const Ground = require("../models/Ground")
const Admin = require("../models/Admin")
const Review = require("../models/Review")
const User = require("../models/User")
const app = require("../utils/firebase")
const {getMessaging} = require("firebase/messaging");

exports.deleteAccount = async(req,res) => {
    try{

        const account = await User.findOneAndDelete({_id: req.user._id},{new: true})

        if(account){

            if(account.usertype==="owner"){
                const grounds = await Ground.deleteMany({ownerid: account._id})
                for(let ground in grounds){
                    await Review.deleteMany({groundid: ground._id})
                    for(let i in ground.photos){
                        cloudinary.uploader.destroy(ground.photos[i].photoid);
                    }
                }
            }

            var registrationToken = []
            let admins = await Admin.find({})
            for(let i=0; i<admins.length; i++){
                registrationToken.push(admins[i].fcmtoken)
            }

            data = {
                account: account,
                message: `${account.usertype} ${account.name} has been deactivated`,
                created: new Date()
            }

            var message = {
                data: data,
                tokens: registrationToken
            };
            
            const response = await getMessaging(app).sendMulticast(message)

            console.log("response...",response)
        
            if(response){
                res.sendStatus(200)
            }

            
        }else{
            throw new Error("Account not found !!")
        }

        res.sendStatus(200)

    }catch(error){
        res.send({error: error.message})
    }
}