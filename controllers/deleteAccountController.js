const Ground = require("../models/Ground")
const Review = require("../models/Review")
const User = require("../models/User")


exports.deleteAccount = async(req,res) => {
    try{

        const account = await User.findOneAndDelete({_id: req.user._id})

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

        res.status(200).send()

    }catch(error){
        res.send({error: error.message})
    }
}