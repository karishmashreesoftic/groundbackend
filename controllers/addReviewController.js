const Ground = require("../models/Ground")
const Review = require("../models/Review")
// const { translate } = require("../../utils/translate")
const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})

exports.addReview = async(req, res) => {
    try{

        if(req.user.usertype==="user"){

            // const lang = process.env.LANGUAGE
            let data = req.body
            data = {
                ...data,
                userid: req.user._id
            }
            console.log(data)

            // if(lang==="ar"){
            //     for(let i in data){
            //         if(i==="review" || i==="location"){
            //             data[i] = await translate.translate(data[i],'en')
            //         }
            //     }
            // }

            const gid = data.groundid
            const g = await Ground.findById(gid)

            if(!g){
                throw new Error("Ground not Found !")
            }

            let newrating = g.rating===0 ? data.rate : (data.rate+g.rating)/2
            newrating = parseFloat(newrating.toFixed(1))
            await Ground.findByIdAndUpdate(gid,{rating: newrating},{new:true})

            const review = new Review(data)
            await review.save()

            // if(lang==="ar"){
            //     for(let i in data){
            //         if(i==="review" || i==="location"){
            //             data[i] = await translate.translate(data[i],lang)
            //         }
            //     }
            // }

            res.status(201).send(review)

        }else{
            throw new Error("Only users are allowed to persorm this action")
        }

    }catch(error){
        res.send({error: error.message})
    }
}