
const Ground = require("../../models/Ground")
const Review = require("../../models/Review")
// const { translate } = require("../../utils/translate")
const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})

exports.getOwnerGroundDetail = async(req, res) => {
    try{

        const gid = req.params.id
        // const lang = process.env.LANGUAGE

        const ground = await Ground.findOne({_id:gid})
        if(ground.length===0){
            throw new Error("No record found for this ground.")
        }
        const reviews = await Review.find({ground : gid}).populate('userid','name profile')
        if(reviews.length===0){
            throw new Error("No reviews found for this ground.")
        }

        // if(lang==='ar'){
        //     for(let i in ground){
        //         if(i!=='_id' && i!=='starttime' && i!=='endtime' && i!=='price' && i!=='rating'){
        //             ground[i] = await translate.translate(ground[i],lang)
        //         }
        //     }
        //     for(let review in reviews){
        //         for(let i in review){
        //             if(i!=='_id' && i!=="rate" && i!=='time'){
        //                 reviews[review][i] = await translate.translate(reviews[review][i],lang)
        //             }
        //         }
        //     }
        // }

        res.status(201).send({ground, reviews})

    }catch(error){
        res.send({error: error.message})
    }
}