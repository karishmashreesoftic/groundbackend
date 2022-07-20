// const { translate } = require("../../utils/translate")
const app = require("../../utils/firebase")
const {getMessaging} = require("firebase/messaging");
const dotenv = require("dotenv");
const Ground = require("../../models/Ground");
const Team = require("../../models/Team");
const User = require("../../models/User");
dotenv.config({path:"config/config.env"})


exports.sendConfirmation = async(req, res) => {
    try{
    
        var sender = req.user
        var type = req.body.type
        var touser = req.body.touser._id
        var registrationToken = await User.findById({_id : touser})
        var team = req.body.teamid? await Team.findById(req.body.teamid) : null
        var ground = req.body.groundid? await Ground.findById(req.body.groundid) : null
        var data = {}

        switch(type){
            case "teamaccept":

                let members = await Team.find({_id: team._id}).select('members')
                members.push(touser)

               await Team.findByIdAndUpdate({_id: team._id}, {members: members}) 

                data = {
                    sender: sender,
                    message: `Your request to join team ${team.name} has been accepted`,
                    created: new Date()
                }
                break;
            
            case "teamreject":
                data = { 
                    sender: sender,
                    message: `Your request to join team ${team.name} has been rejected`,
                    created: new Date()
                }
                break;

            case "groundaccept":

                await User.findByIdAndUpdate({_id: touser}, {$inc : {'noofbooking' : 1}})
                await Ground.findByIdAndUpdate({_id: ground._id}, {$inc: {'nooftimebooked': 1}})

                data = { 
                    sender: sender,
                    message: `Your request to book ground ${ground.name} has been accepted`,
                    created: new Date()
                }  
                break;

            case "groundreject":
                data = { 
                    sender: sender,
                    message: `Your request to book ground ${ground.name} has been rejected`,
                    created: new Date()
                }  
                break;

            default:
                break;
        }

        var message = {
            data: data,
            token: registrationToken
        };

        const response = getMessaging(app).send(message)
        
        if(response){
            res.sendStatus(200)
        }

    }catch(error){
        res.send({error: error.message})
    }
}