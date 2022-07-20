const Ground = require("../../models/Ground")
const User = require("../../models/User")
const Admin = require("../../models/Admin")
const {getMessaging} = require("firebase/messaging");
const app = require("../../utils/firebase")

exports.newGroundRequest = async(req, res) => {
    try{

        if(req.body.status==="approved"){

            const ground = new Ground(req.body.data)
            await ground.save()

            if(ground){
                await Admin.updateMany({pendingapprovals: {$gte : 1}},{$inc: {'pendingapprovals' : -1}})
                await User.findByIdAndUpdate({_id: ownerid},{$inc: {'noofownedgrounds': 1}})
                res.status(201).send(ground)
            }

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

        }else if(req.body.status==="rejected"){

            var registrationToken = await User.find({_id : req.body.owner._id}).select('fcmtoken')
            var ground = req.body.ground

            data = {
                ground: ground,
                message: `Your request to add ground ${ground.groundname} has been rejected`,
                created: new Date()
            }

            var message = {
                data: data,
                token: registrationToken
            };

            const response = getMessaging(app).send(message)
        
            if(response){
                await Admin.updateMany({pendingapprovals: {$gte : 1}},{$inc: {'pendingapprovals' : -1}})
                res.sendStatus(200)
            }
            
        }
        
    }catch(error){
        res.send({error: error.message})
    }
}