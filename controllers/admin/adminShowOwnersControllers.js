const Admin = require("../../models/Admin")
const User = require("../../models/User")
const { startOfDay, endOfDay } = require("date-fns")

async function findData(data, req){

    let q = [{usertype: "owner"}]

    if(data.date){
        let d = new Date(data.date)
        q.push({createdat: { $gte: startOfDay(d), $lte: endOfDay(d)} })
    }
    if(data.new){
        //const admin = req.admin
        const admin = await Admin.findOne({_id: "62d1359255be03e8de14c1ae"})
        if(admin.newownerclicked === null){
            q.push({createdat: { $gte: admin.lasttimeloggedout, $lte: new Date() }})
        }else{
            q.push({createdat: { $gte: admin.newownerclicked, $lte: new Date() }})
        }
    }

    return q;
}

exports.adminShowOwners = async(req, res) => {
    try{

        let data = req.body
        let query = {usertype: "owner"}

        if(Object.keys(data).length!==0){
            let temp = await findData(data, req)
            query = {$and : temp}
        }

        const owners = await User.find(query).select("name mobile noofownedgrounds status createdat").sort({"createdat":"asc"});
        //await Admin.findByIdAndUpdate({_id : req.admin._id},{newownerclicked: new Date()})
        if(data.new){
            await Admin.findByIdAndUpdate({_id : "62d1359255be03e8de14c1ae"},{newownerclicked: new Date()})
        }

        res.status(201).send({owners})

    }catch(error){
        res.send({error: error.message})
    }

}
