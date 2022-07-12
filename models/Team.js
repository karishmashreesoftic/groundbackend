const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({

    name:{
        type: String,
    },
    createdby:{
        type: mongoose.Schema.Types.ObjectId, ref:'User'
    },
    members: [{
        memberid: {
            type: mongoose.Schema.Types.ObjectId, ref:'User'
        }
    }]
})

const Team = mongoose.model('Team',teamSchema)

module.exports = Team
