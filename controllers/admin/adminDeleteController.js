const Ground = require("../../models/Ground")
const Admin = require("../../models/Admin")
const Review = require("../../models/Review")
const User = require("../../models/User")
const AdminNotification = require("../../models/AdminNotification")
// const app = require("../utils/firebase")
// const {getMessaging} = require("firebase/messaging");

exports.adminDeleteAccount = async(req,res) => {
    try{

        const account = await User.findOneAndDelete({_id: req.params.id},{new: true})

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
            
        }else{
            throw new Error("Account not found !!")
        }

        // var registrationToken = []
        // let admins = await Admin.find({})
        // for(let i=0; i<admins.length; i++){
        //     registrationToken.push(admins[i].fcmtoken)
        // }

        data = {
            account: account,
            message: `${account.usertype.charAt(0).toUpperCase()}${account.usertype.slice(1)} ${account.name} has been deactivated`,
        }

        var payload = {
            data: data,
            // tokens: registrationToken
        };

        // const response = await admin.messaging().sendToDevice(registrationToken,payload)
        // const response = await getMessaging(app).sendMulticast(message)
        const m = new AdminNotification({...payload, createdat: new Date(), status: "delivered"})
        await m.save()

        res.sendStatus(200)

    }catch(error){
        res.send({error: error.message})
    }
}