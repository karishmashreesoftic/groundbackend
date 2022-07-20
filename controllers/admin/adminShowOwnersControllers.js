const Admin = require("../../models/Admin")
const User = require("../../models/User")
const { startOfDay, endOfDay } = require("date-fns")

function findData(data, req){

    let q = [{usertype: "owner"}]

    if(data.date){
        let d = new Date(data.date)
        q.push({createdat: { $gte: startOfDay(d), $lte: endOfDay(d)} })
    }
    if(data.new){
        const admin = req.admin
        if(admin.newuserclicked === null){
            q.push({createdat: { $gte: admin.lasttimeloggedout, $lte: new Date() }})
        }else{
            q.push({createdat: { $gte: admin.newuserclicked, $lte: new Date() }})
        }
    }

    return q;
}

exports.adminShowOwners = async(req, res) => {
    try{

        let data = req.body
        let query = {}

        console.log("req.body....",req.body)

        if(Object.keys(data).length!==0){
            let temp = findData(data, req)
            query = {$and : temp}
        }

        const owners = await User.find(query).select("name mobile noofownedgrounds status createdat").sort({"createdat":"asc"});
        await Admin.findByIdAndUpdate({_id : req.admin._id},{newuserclicked: new Date()})
        if(!owners){
            throw new Error("No record found for this filter combination!")
        }

        res.status(201).send(owners)

    }catch(error){
        res.send({error: error.message})
    }

}
