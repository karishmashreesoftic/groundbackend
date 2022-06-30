const Ground = require("../../models/Ground")

function findData(data) {

    let q = []

    if(data.sports.length!==0){
        let sp = []
        let sportsarray = String(data.sports).toLowerCase().split(",")
        sportsarray.forEach(element => {
            let tsp = {
                $regex: element,
                $options: "i"
            }
            sp.push({"description": tsp})
        });
        q.push({$or: sp})
    }
    if(data.country.length!==0){
        let c = {
            $regex: data.country,
            $options: "i"
        }
        q.push({"address" : c})
    }
    if(data.state!==0){
        let s = {
            $regex: data.state,
            $options: "i"
        }
        q.push({"address" : s})
    }
    if(data.location!==0){
        let l = []
        let locationarray = data.location.split(",")
        locationarray.forEach(element => {
            l.push({"location": { $regex : element, $options: "i" }})
        });
        q.push({$or: l})
    }
    if(data.price!==0){
        q.push({"price": data.price})
    }
    if(data.rating!==0){
        q.push({"rating": data.rating})
    }

    return q
}

exports.getGrounds = async(req, res) => {
    try{
        let data = req.body
        let query = {}
        if(data!==null){
            let temp = findData(data)
            query = {$and : temp}
        }
        const grounds = await Ground.find(query).select("groundname location rating photos").sort({"rating":"asc"});
        if(!grounds){
            throw new Error("No record found for this filter combination!")
        }
        res.status(201).send(grounds)

    }catch(error){
        res.send({error: error.message})
    }
}



// {
//     $and:[
//         {$or: [
//             {description: { $regex: "Cricket", $options: "i" } },
//         ]},
//         {address: { $regex: "Add", $options: "i"}},
//         {address: { $regex: "ss 1", $options: "i" }},
//         {$or: [
//              {location: "Katargam"},
//         ]},
//         {price: 10000},
//         {rating: 5}
//     ]
// }

// data = {
//     "sports": ["cricket"],
//     "country": "India",
//     "state": "Gujarat",
//     "location": ["Katargam"],
//     "price": 10000,
//     "rating": 5
// }