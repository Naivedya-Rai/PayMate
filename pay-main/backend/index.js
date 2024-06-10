const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser'); 
const mainRouter = require("./routes/index") //import the main router 

//frontend and backend will be hosted on separate routes so we need to use cors
app.use(cors());  

//need body parser since we have to support JSON body in POST requests
app.use(bodyParser.json());




//app.use is also used to route requests that start with a certain substring over to another router 
app.use("/api/v1", mainRouter);



//app listen on port 3000
app.listen(3000);