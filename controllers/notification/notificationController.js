// const { translate } = require("../../utils/translate")
const {getMessaging} = require("firebase/messaging");
const app = require("../../utils/firebase")
const dotenv = require("dotenv");
const Ground = require("../../models/Ground");
const Team = require("../../models/Team");
const User = require("../../models/Team");
dotenv.config({path:"config/config.env"})


exports.sendNotification = async(req, res) => {
    try{

        var sender = req.user
        var tousers = req.body.tousers
        var type = req.body.type
        var team = req.body.teamid? await Team.findById(req.body.teamid) : null
        var ground = req.body.groundid? await Ground.findById(req.body.groundid) : null
        var data = {}
        var registrationToken = []

        for(let i=0; i<tousers.length; i++){
            const t = await User.findById({_id : tousers[i]})
            registrationToken.push(t)
        }

        switch(type){
            case "addtoteam":
                data = {
                    sender: sender,
                    message: `${sender.fullname} send you a playing invitation to join team ${team.name}`,
                    created: new Date()
                }
                break;
            
            case "bookground":
                data = {
                    sender: sender, 
                    message:`${sender.fullname} wants to book yor ground ${ground.groundname}`,
                    created: new Date()
                }
                break;

            case "jointeam":
                data = {
                    sender: sender, 
                    message:`${sender.fullname} wants to join team ${team.name}`,
                    created: new Date()
                }  
                break;

            default:
                break;
        }

        var message = {
            data: data,
            tokens: registrationToken
        };

        const response = getMessaging(app).sendMulticast(message)
        
        if(response){
            res.sendStatus(200)
        }

        // process.env["LANGUAGE"] = req.body.lang;
        // res.status(200).send({lang: process.env.LANGUAGE})

    }catch(error){
        res.send({error: error.message})
    }
}