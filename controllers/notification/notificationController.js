// const { translate } = require("../../utils/translate")
const admin = require("../../utils/firebase")
const dotenv = require("dotenv");
const Ground = require("../../models/Ground");
const Team = require("../../models/Team");
dotenv.config({path:"config/config.env"})


exports.sendNotification = async(req, res) => {
    try{
    
        var registrationToken = req.body.fcmToken
        var type = req.body.type
        var user = req.user
        var team = req.body.teamid? await Team.findById(req.body.teamid) : null
        var ground = req.body.groundid? await Ground.findById(req.body.groundid) : null
        var data = {}

        switch(type){
            case "addtoteam":
                data = {
                    sender: user.fcmtoken,
                    message: `${user.fullname} send you a playing invitation to join team ${team.name}`,
                    created: new Date()
                }
                break;
            
            case "bookground":
                data = {
                    sender: user.fcmtoken, 
                    message:`${user.fullname} wants to book yor ground ${ground.groundname}`,
                    created: new Date()
                }
                break;

            case "jointeam":
                data = {
                    sender: user.fcmtoken, 
                    message:`${user.fullname} wants to join team ${team.name}`,
                    created: new Date()
                }  
                break;

            default:
                break;
        }

        var payload = {
            data: data
        };

        admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(function(response) {
            console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
        });

        // process.env["LANGUAGE"] = req.body.lang;
        // res.status(200).send({lang: process.env.LANGUAGE})

    }catch(error){
        res.send({error: error.message})
    }
}