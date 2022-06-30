const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})

const User = require("../../models/User");

exports.authFacebook = async(req,res) => {
    try {

        let user;

        const fetch_access_token_url = `https://graph.facebook.com/<API_VERSION>/oauth/access_token?
        client_id=${process.env.FACEBOOK_APP_ID}
        &redirect_uri=<YOUR_URL>
        &client_secret=${process.env.FACEBOOK_APP_SECRET}
        &code=${req.params.idToken}`

        const ACCESS_TOKEN = ""
        const USER_ID = ""
        const fetch_user_url = `https://graph.facebook.com/${USER_ID}?fields=id,name,email,picture&access_token=${ACCESS_TOKEN}`
        
        const response = await fetch(fetch_user_url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          });
    
        const result = await response.json()
        user = await User.findOne({socialid: result.id})

        if(!user){
            const data = {
                socialid: result.id,
                name: result.name,
                email: result.email,
                profile: result.picture.data.url,
                usertype: req.params.userType
            }
            const user = new User(data)
            await user.save()

            res.status(201).send({new:"true",user: user})
            
        }

        res.status(201).send({new:"false",user: user})
        
    } catch (error) {
        res.status(201).status({error: error.message});
    }
}

        // {
        //     "id": "USER-ID",
        //     "name": "EXAMPLE NAME",
        //     "email": "EXAMPLE@EMAIL.COM",
        //     "picture": {
        //       "data": {
        //         "height": 50,
        //         "is_silhouette": false,
        //         "url": "URL-FOR-USER-PROFILE-PICTURE",
        //         "width": 50
        //       }
        //     }
        //  }