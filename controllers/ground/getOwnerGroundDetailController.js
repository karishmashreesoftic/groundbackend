
const Ground = require("../../models/Ground")
const Review = require("../../models/Review")

exports.getOwnerGroundDetail = async(req, res) => {
    try{

        const gid = req.params.id
        const ground = await Ground.findOne({_id:gid})
        if(ground.length===0){
            throw new Error("No record found for this ground.")
        }
        const reviews = await Review.find({ground : gid}).populate('userid','name profile')
        if(reviews.length===0){
            throw new Error("No reviews found for this ground.")
        }

        res.status(201).send({ground, reviews})

    }catch(error){
        res.send({error: error.message})
    }
}