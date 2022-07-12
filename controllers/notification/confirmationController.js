// const { translate } = require("../../utils/translate")
const admin = require("../../utils/firebase")
const dotenv = require("dotenv");
const Ground = require("../../models/Ground");
const Team = require("../../models/Team");
dotenv.config({path:"config/config.env"})


exports.sendConfirmation = async(req, res) => {
    try{
    
        var registrationToken = req.body.fcmToken
        var type = req.body.type
        var user = req.user
        var team = req.body.teamid? await Team.findById(req.body.teamid) : null
        var ground = req.body.groundid? await Ground.findById(req.body.groundid) : null
        var data = {}

        switch(type){
            case "teamaccept":
                data = {
                    message: `Your request to join team ${team.name} has been accepted`,
                    created: new Date()
                }
                break;
            
            case "teamreject":
                data = { 
                    message: `Your request to join team ${team.name} has been rejected`,
                    created: new Date()
                }
                break;

            case "groundaccept":
                data = { 
                    message: `Your request to book ground ${ground.name} has been accepted`,
                    created: new Date()
                }  
                break;

            case "groundreject":
                data = { 
                    message: `Your request to book ground ${ground.name} has been accepted`,
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

    }catch(error){
        res.send({error: error.message})
    }
}