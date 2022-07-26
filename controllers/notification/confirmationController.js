// const { translate } = require("../../utils/translate")
// const app = require("../../utils/firebase")
// const {getMessaging} = require("firebase/messaging");
const dotenv = require("dotenv");
const Ground = require("../../models/Ground");
const Team = require("../../models/Team");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
dotenv.config({path:"config/config.env"})


exports.sendConfirmation = async(req, res) => {
    try{
    
        const sender = req.user
        const type = req.body.type
        var touser = req.body.touser._id
        const nid = req.body.nid
        const registrationToken = await User.findById({_id : touser})
        const team = req.body.teamid? await Team.findById(req.body.teamid) : null
        const ground = req.body.groundid? await Ground.findById(req.body.groundid) : null
        var data = {}

        switch(type){
            case "teamaccept":

                let members = await Team.find({_id: team._id}).select('members')
                members.push(touser)

               await Team.findByIdAndUpdate({_id: team._id}, {members: members})
               await Notification.findByIdAndUpdate({_id: nid}, {status: "accepted", seenby: sender._id, seenat: new Date()})

                data = {
                    sender: sender,
                    message: `Your request to join team ${team.name} has been accepted`,
                    created: new Date()
                }
                break;
            
            case "teamreject":
                await Notification.findByIdAndUpdate({_id: nid}, {status: "rejected", seenby: sender._id, seenat: new Date()})
                data = { 
                    sender: sender,
                    message: `Your request to join team ${team.name} has been rejected`,
                    created: new Date()
                }
                break;

            case "groundaccept":

                await User.findByIdAndUpdate({_id: touser}, {$inc : {'noofbooking' : 1}})
                await Ground.findByIdAndUpdate({_id: ground._id}, {$inc: {'nooftimebooked': 1}})
                await Notification.findByIdAndUpdate({_id: nid}, {status: "accepted", seenby: sender._id, seenat: new Date()})

                data = { 
                    sender: sender,
                    message: `Your request to book ground ${ground.name} has been accepted`,
                    created: new Date()
                }  
                break;

            case "groundreject":
                await Notification.findByIdAndUpdate({_id: nid}, {status: "rejected", seenby: sender._id, seenat: new Date()})
                data = { 
                    sender: sender,
                    message: `Your request to book ground ${ground.name} has been rejected`,
                    created: new Date()
                }  
                break;

            default:
                break;
        }

        var payload = {
            data: data
        }

        // const response = await admin.messaging().sendToDevice(registrationToken, payload)

        // var message = {
        //     data: data,
        //     token: registrationToken
        // };

        // const response = getMessaging(app).send(message)
        
        // if(response){
        //     res.sendStatus(200)
        // }

        res.sendStatus(200)

    }catch(error){
        res.send({error: error.message})
    }
}