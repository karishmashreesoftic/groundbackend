const Ground = require("../../models/Ground")

exports.getSingleGround = async(req, res) => {
    try{
        const ground = await Ground.findById(req.params.id)
        if(!ground){
            throw new Error("Ground not found")
        }
        res.status(201).send(ground)
    }catch(error){
        res.send({error: error.message})
    }
}