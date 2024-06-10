const {JWT_SECRET} = require("./config");
const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;

    //checks if there is no auth header or if auth header doesnt start with Bearer then throw error
    if(!authHeader ||  !authHeader.startsWith('Bearer ')){
        return res.status(403).json({});
    }


    //since format is 'Bearer hdbibahd' then it splits the string on the space and which leads to [Bearer, hdbi..] so [1] will return the token
    const token = authHeader.split(' ')[1];

    try {

        //decodes the payload and verifies it with the help of the signature using the secret key 
        const decoded = jwt.verify(token, JWT_SECRET)

        if (decoded.userId){
            //puts userId in the request object if the token is verified
            req.userId = decoded.userId;
            next();
        }


    //if not error is sent to the user 
    } catch(err) {
        return res.status(403).json({});
    }
}

module.exports = {
    authMiddleware
}