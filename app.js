import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); 
//import "./models/mongooseConnection.js"
import usersRoute from './routes/usersroute.js';
import recordsRoute from './routes/recordsroute.js';
import ordersRoute from './routes/ordersroute.js';
import verifyToken from './middlewares/authenticationVerification.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
//import cors from 'cors';


// creating /initializing express server
const app = express();

//const PORT = 5000;
const PORT = process.env.PORT || 4000; 

//console.log(process.env.MONGO_URI);

// create mongoose connection
mongoose.connect( `${process.env.MONGO_URI}`, ()=> {
    
    console.log("DB connection established!")

})
// app.use: all methods: get,post,patch...
// app.use(); 

// most of time we will use
//app.use((req,res,next) => {
//    console.log(req.url)
//    next();
//})

//instead of above we can call morgan
app.use( morgan("dev") ) 

// app.use("/hello", morgan("dev"));


// express json middleware to parse any incoming json data
app.use(express.json())


//express parsing url encoded data
//app.use(express.urlencoded({extended:true}))

//cookie parser
app.use(cookieParser()) // this middleware parsing cookies

//CORS middleware
//app.use(cors({origin:"http://localhost:3000", exposedHeaders: ["token"]}))


//config multer package
//const upload = multer({dest: "upload/"}) 

// setup multer diskStorage
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        let fullPath = "./upload"
        cb(null,fullPath) 
    },
    filename: function (req,file,cb){
        
        //let fileName = Date.now()+ "_" +file.originalname
        let fileName = Date.now() + file.originalname
        cb(null,fileName)
    }
})
const upload = multer({storage: storage}) /


// serve static files/pages
app.use(express.static("upload"))

// serve static files in views/build folder
app.use(express.static("views/build")) 

// to serve our clients side routing
app.get("/",(req,res)=> {
    res.sendFile("./views/build/index.html", {root:"."})
    
}) 

//Customer middleware

//function log(req,res,next){
//    console.log("I am a middleware")
//    //it will stay here, holding request here. we need to use next
//    
//    //next("hello") 
//
//    next()
//
//} 

//
//function checkMethod(req,res,next){
//
//    console.log("I am second middleware")
//    
//    next()
//}
//
//function thirdMiddleware(req,res,next){
//
//    console.log("I am third middleware")
//
//}

//app.use(log);
//app.use(checkMethod)
//app.use("/middleware",log, checkMethod, thirdMiddleware) 

//app.use(log, checkMethod, thirdMiddleware) 
//app.use([log, checkMethod, thirdMiddleware]) 

// MVC Architecture
// Models (for databases/ data storage) - Views (UI, frontend, presentational data) - Controllers (request handlers, logic)
// We want/have to organize our code. 

// Routes

// Route GET "/"
//app.get("/",  (req,res, next)=> {
//
//    console.log("I am in the middle");
//    //res.send("Response from middleware") 

//    next(); 
//
//}, (req,res, next)=> {
//
//    console.log("I am second in the row");
//
//    next();
//
//}, (req,res)=> {
//
//    //Controller //request handler
//
//    //res.send("Hi from server")
//    // send() -> simple string data
//    // sendFile()
//    // json()
// 
//
//    res.send("I am done")
//
//}) 


//Routes we will create:
// "/users" GET POST PATCH DELETE 
//app.use(usersRoute); 
app.use("/users",upload.single('image'), usersRoute); 

//app.use("/users",log,usersRoute);

// "/records" GET POST PATCH DELETE
//app.use(recordsRoute);
app.use("/records",recordsRoute);

// "/orders" GET POST PATCH DELETE
//app.use(ordersRoute);
app.use("/orders",ordersRoute);
//app.use("/orders",verifyToken, ordersRoute);


// handling 404 page not found error (error handling middleware)

app.use( (req,res, next) => {
    //res.json({success:false, message: "there is no such route"})
    res.sendFile("./views/pageNotFound.html", {root:"."})
    //res.status(404).sendFile("./views/pageNotFound.html", {root:"."})
} ) 

//other then 404 page.
//universal error handler middleware
app.use((err, req, res, next)=> { 

    // res.json({success:false, message: err.message})
    // res.json({success:false, message: err}) 

    // we add err status so it should be:
    //res.status(err.status).json({success:false, message: err.message})
    
    res.status(err.status || 500);
    res.json({success:false, message: err.message})


}) 


// listening request on port 4000
app.listen(PORT, () => console.log("server is running on port", PORT))