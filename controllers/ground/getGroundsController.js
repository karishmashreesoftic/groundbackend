// const { translate } = require("../../utils/translate")
const Ground = require("../../models/Ground")
const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})

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
    if(data.state.length!==0){
        let s = {
            $regex: data.state,
            $options: "i"
        }
        q.push({"address" : s})
    }
    if(data.location.length!==0){
        let l = []
        let locationarray = data.location.split(",")
        locationarray.forEach(element => {
            l.push({"location": { $regex : element, $options: "i" }})
        });
        q.push({$or: l})
    }
    if(data.price.length!==0){
        q.push({"price": data.price})
    }
    if(data.rating.length!==0){
        q.push({"rating": data.rating})
    }

    return q
}

exports.getGrounds = async(req, res) => {
    try{
        // const lang = process.env.LANGUAGE
        let data = req.body
        let query = {}

        if(data!==null){
            // if(lang=='ar'){
            //     for(let i in data){
            //         if(i!=='price' && i!=='rating'){
            //             data[i] = await translate.translate(data[i],'en')
            //         }
            //     }
            // }
            let temp = findData(data)
            query = {$and : temp}
        }

        const grounds = await Ground.find(query).select("groundname location rating photos").sort({"rating":"asc"});
        if(!grounds){
            throw new Error("No record found for this filter combination!")
        }

        // if(lang=='ar'){
        //     for(let ground in grounds){
        //         for(let i in ground){
        //             if(i!=='_id' && i!=="rating" && i!=="photos"){
        //                 grounds[ground][i] = await translate.translate(grounds[ground][i],lang)
        //             }
        //         }
        //     }
        // }

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