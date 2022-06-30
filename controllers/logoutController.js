const User =  require('../models/User')

exports.logout = async(req,res) =>{
    try{
        const updated_tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await User.findOneAndUpdate({_id: req.user._id},{tokens: updated_tokens})
        res.status(200).send()
    }catch(error){
        res.send({error: error.message})
    } 
}

exports.logoutAll = async(req,res) =>{
    try{
        await User.findOneAndUpdate({_id: req.user._id},{tokens: []}) 
        res.status(200).send()
    }catch(error){
        res.send({error: error.message})
    }   
}