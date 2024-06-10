const express = require('express')
const router = express.Router();
const zod = require("zod");
const { JWT_SECRET } = require('../config');
const { User, Account } = require("../db")
const jwt = require('jsonwebtoken');
const {authMiddleware} = require("../middleware")


//zod schema structure for validation
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string(),
    lastName: zod.string()
})

//signup API
router.post("/signup", async (req, res) => {
    const body = req.body;

    //use destructuring directly to check if its successful or not and parse the schema/ validating using zod
    const { success } = signupSchema.safeParse(req.body);

    //check if successfull is true
    if (!success) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    //find existing user
    //User.findOne returns a promise, so you should await it to get the result correctly. 
    //Without awaiting, user will be a promise, not the result of the query.
    //if this user exists and returns true it means email already exists 

    const user = await User.findOne({
        username: body.username
    })
    if (user) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    //create new user
    const dbUser = await User.create(body);

    const userId = dbUser._id;

    //Create new acc and give a random acc balance

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    //create JWT
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token
    })
})

//zod schema structure for signin validation
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
})

//signin endpoint
router.post("/signin", async (req, res) => {
    const body = req.body;

    //use destructuring directly to check if its successful or not and parse the schema/ validating using zod
    const { success } = signupSchema.safeParse(req.body);

    //check if successfull is true
    if (!success) {
        return res.status(411).json({
            message: "Error while logging in"
        })
    }

    const user = await User.findOne({
        username: body.username,
        password: body.password
    })
    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)

        res.status(200).json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })

})

//zod schema structure for update validation
const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

//update endoint, takes auth middleware to authenticate user
router.put("/", authMiddleware, async(req,res) => {

    const {success} = updateSchema.safeParse(req.body)

    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    //update user info in the db
    await User.updateOne(req.body,{
        id: req.userId
    })

    res.status(200).json({
        message: "updated successfully"
    })
})

//endpoint to get users from the backend
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
                {
                   firstName: { "$regex": filter }
                },
                {
                   lastName: { "$regex": filter }
                }
             ]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


//export the router
module.exports = router;

















/* ugly long way for zod validation schema 
const usernameSchema = zod.string().email();
const passwordSchema = zod.string().min(6);
const firstNameSchema = zod.string()
const lastNameScehema = zod.string()
*/