const Ground = require("../../models/Ground")
const User = require("../../models/User")
const Admin = require("../../models/Admin")
// const {getMessaging} = require("firebase/messaging");
// const admin = require("../../utils/firebase");
const AdminNotification = require("../../models/AdminNotification");
const cloudinary = require("../../utils/cloudinary")

exports.newGroundRequest = async(req, res) => {
    try{

        if(req.body.status==="approved"){

            const ground = new Ground(req.body.ground)
            await ground.save()

            if(ground){

                //await AdminNotification.findOneAndUpdate({_id: req.body._id}, {status: "approved", seenat: new Date(), seenby: req.admin._id}, {new: "true"})
                await AdminNotification.findOneAndUpdate({_id: req.body._id}, {status: "approved", seenat: new Date(), seenby: "62d1359255be03e8de14c1ae"}, {new: "true"})
                await Admin.updateMany({pendingapprovals: {$gte : 1}},{$inc: {'pendingapprovals' : -1}}, {new: "true"})
                await User.findOneAndUpdate({_id: ground.ownerid},{$inc: {'noofownedgrounds': 1}}, {new: "true"})

                var registrationToken = await User.find({_id : req.body.owner._id}).select('fcmtoken')
    
                data = {
                    ground: ground,
                    message: `Your request to add ground ${ground.groundname} has been accepted`,
                    created: new Date()
                }
    
                var payload = {
                    data: data,  
                };

                const n = new Notification({...payload, token: registrationToken, createdat: data.created})
                await n.save()

                // const response = await admin.messaging().sendToDevice(registrationToken, payload)
                // console.log("response...",response)

                // await AdminNotification.findByIdAndUpdate({_id: req.body._id}, {status: "approved", seenat: new Date(), seenby: req.admin._id})
                // await Admin.updateMany({pendingapprovals: {$gte : 1}},{$inc: {'pendingapprovals' : -1}})
                // await User.findByIdAndUpdate({_id: ground.ownerid},{$inc: {'noofownedgrounds': 1}})

                // var registrationToken = await User.find({_id : req.body.owner._id}).select('fcmtoken')
    
                // data = {
                //     ground: ground,
                //     message: `Your request to add ground ${ground.groundname} has been accepted`,
                //     created: new Date()
                // }
    
                // var message = {
                //     data: data,
                //     token: registrationToken
                // };

                // const n = new Notification({...message, createdat: data.created})
                // await n.save()
                // const response = await getMessaging(app).send(message)

                res.sendStatus(200)
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

            //await AdminNotification.findByIdAndUpdate({_id: req.body._id}, {status: "rejected", seenat: new Date(), seenby: req.admin._id})
            await AdminNotification.findByIdAndUpdate({_id: req.body._id}, {status: "rejected", seenat: new Date(), seenby: "62d1359255be03e8de14c1ae"})
            await Admin.updateMany({pendingapprovals: {$gte : 1}},{$inc: {'pendingapprovals' : -1}})

            for(let i in req.body.data.ground.photos){
                cloudinary.uploader.destroy(req.body.data.ground.photos[i].photoid);
            }

            var registrationToken = await User.find({_id : req.body.owner._id}).select('fcmtoken')
            var ground = req.body.ground

            data = {
                ground: ground,
                message: `Your request to add ground ${ground.groundname} has been rejected`,
                created: new Date()
            }

            var payload = {
                data: data,
            };
            
            const n = new Notification({...payload, token: registrationToken, createdat: data.created})
            await n.save()

            // const response = await admin.messaging().sendToDevice(registrationToken, payload)
            // console.log("response...",response)

            // await AdminNotification.findByIdAndUpdate({_id: req.body._id}, {status: "rejected", seenat: new Date(), seenby: req.admin._id})
            // await Admin.updateMany({pendingapprovals: {$gte : 1}},{$inc: {'pendingapprovals' : -1}})

            // for(let i in req.body.data.ground.photos){
            //     cloudinary.uploader.destroy(req.body.data.ground.photos[i].photoid);
            // }

            // var registrationToken = await User.find({_id : req.body.owner._id}).select('fcmtoken')
            // var ground = req.body.ground

            // data = {
            //     ground: ground,
            //     message: `Your request to add ground ${ground.groundname} has been rejected`,
            //     created: new Date()
            // }

            // var message = {
            //     data: data,
            //     token: registrationToken
            // };

            // const n = new Notification({...message, createdat: data.created})
            // await n.save()

            // const response = await getMessaging(app).send(message)

            res.sendStatus(200)
        }
        
    }catch(error){
        res.send({error: error.message})
    }
}