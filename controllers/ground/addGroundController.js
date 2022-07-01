const Ground = require("../../models/Ground")
const cloudinary = require("../../utils/cloudinary")
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const { translate } = require("../../utils/translate")

exports.addGround = async(req, res) => {

    try{

        let p_array = []
        for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index].path;
            const image = await cloudinary.uploader.upload(element,{folder: 'groundphotos'})
            const photo = {photoid: image.public_id, photourl: image.secure_url, photothumbnail: image.secure_url.replace("/image/upload","/image/upload/c_fill,w_350,h_300")}
            p_array.push(photo)
            await unlinkAsync(element)
        }

        let temp = {
            groundname : req.body.groundname,
            location: req.body.location,
            ownername: req.body.ownername,
            starttime: req.body.starttime,
            endtime: req.body.endtime,
            price: req.body.price,
            address: req.body.address,
            description: req.body.description,
            photos: p_array
        }

        const ground = new Ground(temp)
        await ground.save()

        let temp_ar = {
            "groundname": "Ground 2",
            "location": "Katargam",
            "ownername": "Owner 2",
            "address": "Gujarat, India",
            "description": "Cricket, Football",
        }

        res.status(201).send(ground)

    }catch(error){
        res.send({error: error.message})
    }
}