const Ground = require("../../models/Ground")
const Review = require("../../models/Review")
const cloudinary = require("../../utils/cloudinary")

exports.deleteGround = async(req,res) => {
    try{

        if(req.user.usertype==="owner"){

            const ground = await Ground.findOneAndDelete({_id:req.params.id})
            if(ground){

                await Review.deleteMany({groundid: req.params.id})
                for(let i in ground.photos){
                    cloudinary.uploader.destroy(ground.photos[i].photoid);
                }

            }else{
                throw new Error("Ground not found !!")
            }

            res.status(200).send()

        }else{
            throw new Error("Only owners are allowed to perform this action")
        }

    }catch(error){
        res.send({error: error.message})
    }
}