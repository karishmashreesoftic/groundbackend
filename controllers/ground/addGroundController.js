const Admin = require("../../models/Admin")
const cloudinary = require("../../utils/cloudinary")
const app  = require("../../utils/firebase")
const {getMessaging} = require("firebase/messaging");
// const LanguageDetect = require('languagedetect');
// const lngDetector = new LanguageDetect();
// lngDetector.setLanguageType("iso2")
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
// const { translate } = require("../../utils/translate")
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
                const photo = {photoid: image.public_id, photourl: image.secure_url, photothumbnail: image.secure_url.replace("/image/upload","/image/upload/c_limit,w_350,h_200")}
                p_array.push(photo)
                await unlinkAsync(element)
            }

            // if(lang==='ar'){
            //     for(let i in data){
            //         if(i!=='price' && i!=='starttime' && i!=='endtime' && i!=="photos"){
            //             if(lngDetector.detect(data[i],1)[0][0]=="ar"){
            //                 data[i] = await translate.translate(data[i],'en')
            //             }
            //         }
            //     }
            // }

            let temp = {
                ...data,
                ownerid: req.user._id,
                photos: p_array
            }

            var registrationToken = []
            let admins = await Admin.find({})
            for(let i=0; i<admins.length; i++){
                registrationToken.push(admins[i].fcmtoken)
            }

            data = {
                sender: req.user, 
                ground: temp,
                message: `Owner ${req.user.name} sent you ground verification message`,
                created: new Date()
            }

            var message = {
                data: data,
                tokens: registrationToken
            };

            const response = getMessaging(app).sendMulticast(message)
        
            if(response){
                await Admin.updateMany({},{$inc: {'pendingapprovals' :1}})
                res.sendStatus(200)
            }

        }else{
            throw new Error("Only owners are allowed to perform this action")
        }

    }catch(error){
        res.send({error: error.message})
    }
}