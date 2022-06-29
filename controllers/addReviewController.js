const Ground = require("../models/Ground")
const Review = require("../models/Review")

exports.addReview = async(req, res) => {
    try{
        const data = req.body
        const gid = data.groundid
        const g = await Ground.findById(gid)
        let newrating = g.rating===0 ? data.rate : (data.rate+g.rating)/2
        newrating = parseFloat(newrating.toFixed(1))

        await Ground.findByIdAndUpdate(gid,{rating: newrating},{new:true})

        const review = new Review(data)
        await review.save()

        res.status(201).send(review)

    }catch(error){
        res.send({error: error.message})
    }
}