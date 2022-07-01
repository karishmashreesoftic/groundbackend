const Ground = require("../../models/Ground")
const cloudinary = require("../../utils/cloudinary")
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
//const { translate } = require("../../utils/translate")
const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})

exports.addGround = async(req, res) => {

    try{

        if(req.user.usertype==="owner"){

            const data = req.body
            // const lang = process.env.LANGUAGE

            let p_array = []
            for (let index = 0; index < req.files.length; index++) {
                const element = req.files[index].path;
                const image = await cloudinary.uploader.upload(element,{folder: 'groundphotos'})
                const photo = {photoid: image.public_id, photourl: image.secure_url, photothumbnail: image.secure_url.replace("/image/upload","/image/upload/c_fill,w_350,h_300")}
                p_array.push(photo)
                await unlinkAsync(element)
            }

            // if(lang==='ar'){
            //     for(let i in data){
            //         if(i!=='price' && i!=='starttime' && i!=='endtime'){
            //             data[i] = await translate.translate(data[i],'en')
            //         }
            //     }
            // }

            let temp = {
                ...data,
                ownerid: req.user._id,
                photos: p_array
            }

            const ground = new Ground(temp)
            await ground.save()

            // if(lang!=='ar'){
            //     let ground_ar = {
            //         ...ground,
            //         groundname: await translate.translate(ground.groundname,lang),
            //         location: await translate.translate(ground.location,lang),
            //         ownername: await translate.translate(ground.ownername,lang),
            //         address: await translate.translate(ground.address,lang),
            //         description: await translate.translate(ground.description,lang),
            //     }
            //     res.status(201).send(ground_ar)
            // }
                

            res.status(201).send(ground)

        }else{
            throw new Error("Only owners are allowed to perform this action")
        }

    }catch(error){
        res.send({error: error.message})
    }
}