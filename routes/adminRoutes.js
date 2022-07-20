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

const adminRouter = Router();


adminRouter.post("/adminsignup", adminSignup)
adminRouter.post("/adminlogin", adminLogin)

adminRouter.get("/dashboard", adminauth, dashboard)
adminRouter.post("/adminshowusers", adminauth, adminShowUsers)
adminRouter.post("/adminshowowners", adminauth, adminShowOwners)
adminRouter.post("/adminreviewandrating", adminauth, adminRandR)

adminRouter.post("/verifiedground", adminauth, newGroundRequest)

adminRouter.get("/adminlogout", adminauth, adminLogout)


module.exports = adminRouter;