const { Router } = require("express")
const { getGrounds } = require("../controllers/ground/getGroundsController")
const { sendOTP, verifyOTP } = require("../controllers/signin/otpController")
const { logout, logoutAll } =  require("../controllers/logoutController")
const { authGoogle } = require("../controllers/signin/googleController");
const { authApple } = require("../controllers/signin/appleController");
const { authFacebook } = require("../controllers/signin/facebookController")
const { auth } = require('../middleware/auth')


const commonRouter = Router();


commonRouter.get("/", (req,res)=>{
    res.send('OK')
})
commonRouter.post("/getgrounds", getGrounds)

commonRouter.post("/sendotp", sendOTP)
commonRouter.post("/verifyotp/:userType", verifyOTP)

commonRouter.get("/auth/google/:userType/:idToken", authGoogle)
commonRouter.get("/auth/apple/:userType/:idToken", authApple)
commonRouter.get("/auth/facebook/:userType/:idToken", authFacebook)

commonRouter.get("/logout", auth, logout)
commonRouter.get("/logoutall", auth, logoutAll)

module.exports = commonRouter;