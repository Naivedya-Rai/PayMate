const express = require('express')
const router = express.Router();

//import the userRouter
const userRouter = require("./user")
const accountRouter = require("./account")

//redirect /user to user router - basically all requests /api/v1/user get routed to userRouter
router.use("/user", userRouter)
router.use("/account", accountRouter)


//export the router
module.exports = router;

// because we know that all requests will start from /api/v1/user .. 