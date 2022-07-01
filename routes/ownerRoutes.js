const { Router } = require("express")
const { addGround } = require("../controllers/ground/addGroundController")
const { getOwnerGroundDetail } = require("../controllers/ground/getOwnerGroundDetailController")
const { upload } = require("../utils/multer")
const { auth } = require('../middleware/auth')
const { deleteGround } = require("../controllers/ground/deleteGroundController")

const ownerRouter = Router();


ownerRouter.post("/addground", auth, upload.array('photos'), addGround)
ownerRouter.get("/getownergrounddetail/:id", auth, getOwnerGroundDetail)
ownerRouter.delete("/deleteground/:id", auth, deleteGround)


module.exports = ownerRouter;