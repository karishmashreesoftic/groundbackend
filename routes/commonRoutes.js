const { Router } = require("express")
const { getGrounds } = require("../controllers/ground/getGroundsController")
const { sendOTP, verifyOTP } = require("../controllers/signin/otpController")
const { authGoogle } = require("../controllers/signin/googleController");
const { authApple } = require("../controllers/signin/appleController");
const { authFacebook } = require("../controllers/signin/facebookController")


const commonRouter = Router();


commonRouter.post("/getgrounds", getGrounds)

commonRouter.post("/sendotp", sendOTP)
commonRouter.post("/verifyotp/:userType", verifyOTP)

commonRouter.get("/auth/google/:userType/:idToken", authGoogle)
commonRouter.get("/auth/apple/:userType/:idToken", authApple)
commonRouter.get("/auth/facebook/:userType/:idToken", authFacebook)


module.exports = commonRouter;