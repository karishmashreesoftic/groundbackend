const { Router } = require("express")
const { adminauth } = require("../middleware/adminauth")
const { adminSignup } = require("../controllers/admin/adminSignupController")
const { adminLogin } = require("../controllers/admin/adminLoginController");
const { dashboard } = require("../controllers/admin/adminDashboardController");
const { adminShowUsers } = require("../controllers/admin/adminShowUsersController");
const { adminShowOwners } = require("../controllers/admin/adminShowOwnersControllers");
const { adminLogout } = require("../controllers/admin/adminLogoutController");
const { adminRandR } = require("../controllers/admin/adminRandRController");
const { newGroundRequest } = require("../controllers/admin/newGroundRequestController.js");
const { adminNotifications } = require("../controllers/admin/adminNotificationController")

const adminRouter = Router();


adminRouter.post("/adminsignup", adminSignup)
adminRouter.post("/adminlogin", adminLogin)

adminRouter.get("/dashboard", dashboard)
adminRouter.post("/adminshowusers", adminShowUsers)
adminRouter.post("/adminshowowners", adminShowOwners)
adminRouter.post("/adminreviewandrating", adminRandR)
adminRouter.post("/adminnotifications", adminNotifications)

adminRouter.post("/verifiedground", newGroundRequest)

adminRouter.get("/adminlogoutall", adminauth, adminLogout)
adminRouter.get("/adminlogout", adminauth, adminLogout)


module.exports = adminRouter;