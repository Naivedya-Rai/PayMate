//import mongoose backend/db.js
const mongoose = require("mongoose") 
const { Schema } = require("zod")


//connect to mongoDB
mongoose.connect("mongodb+srv://leorai259:Argentina$$2022@cluster0.qgpfb.mongodb.net/Payments")

//define a user schema - with constraints 
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
})

//define an AccountSchema with constraints like userId using ref
const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
})


//create a model from the schema
const User = mongoose.model('User', UserSchema)
const Account = mongoose.model('Account', AccountSchema)

//export the model 
module.exports = {
    User,
    Account
}














/* less elegant approach - not production level
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
})
*/
