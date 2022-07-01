const Ground = require("../../models/Ground")
const Review = require("../../models/Review")


exports.deleteGround = async(req,res) => {
    try{

        if(req.user.usertype==="owner"){

            const ground = await Ground.findOneAndDelete({_id:req.params.id})
            if(ground){
                await Review.deleteMany({groundid: req.params.id})
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