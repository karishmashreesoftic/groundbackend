const { Router } = require("express")
const { getSingleGround } = require("../controllers/ground/getSingleGroundController")
const { addReview } = require("../controllers/addReviewController")
const { auth } = require('../middleware/auth')


const userRouter = Router();


userRouter.get("/getsingleground/:id", auth, getSingleGround)
userRouter.post("/addreview", auth, addReview)



module.exports = userRouter;