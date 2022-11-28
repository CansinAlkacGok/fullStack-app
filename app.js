import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // need to initialize it to use this package. configure all env variable into process.env 
//import "./models/mongooseConnection.js"
import usersRoute from './routes/usersroute.js';
import recordsRoute from './routes/recordsroute.js';
import ordersRoute from './routes/ordersroute.js';
import verifyToken from './middlewares/authenticationVerification.js';
// we can name it anything we want here.otherwise we need to import route object three times from different files.
import cookieParser from 'cookie-parser';
import multer from 'multer';
//import cors from 'cors';


// creating /initializing express server
const app = express();

//const PORT = 5000; // we need to make it dynamic. because someone also use it and it can be busy.
const PORT = process.env.PORT || 4000; // it will automatically assign a port if its available or 4000.

//console.log(process.env.MONGO_URI);

// We can create mongoose connection in models folder and then import just the file here. actually we load the file here not import something because we don't export anything from mongooseConnection file.
// create mongoose connection
mongoose.connect( `${process.env.MONGO_URI}`, ()=> {
    // we will use another uri here. so we can make it dynamic with env variables

    console.log("DB connection established!")

}) // its in our local machine so it will work just for us. when we we deploy the site then we need to start to use cloud, means mongo Atlas then it will for anyone else 
// we can name it whatever we want instead of live-coding-record-shop


// app.use: all methods: get,post,patch...
// app.use(); // whatever request we are receiving, all methods will come with use.
// most of time we will use
//app.use((req,res,next) => {
//    console.log(req.url)
//    next();
//})

//instead of above we can call morgan
app.use( morgan("dev") ) // -> it show which request you will receive with which endpoint and what response and how many ms it takes
// we can also add condition like:
// app.use("/hello", morgan("dev"));
// here we have external middleware
// there are external and custom middleware. external middleware we have to call it.if we use custom middleware we don't have to call. 
// purpose of external middleware is only forward the request. they cannot send response. but custom middleware can do anything

// express json middleware to parse any incoming json data
app.use(express.json())

//the middleware below not fixed issue but I am keeping it. the issue is we cannot see image that user send us. we fixed it by removing header in post request that we created in frontend
//express parsing url encoded data
//app.use(express.urlencoded({extended:true}))

//cookie parser
app.use(cookieParser()) // this middleware parsing cookies

//CORS middleware
//app.use(cors({origin:"http://localhost:3000", exposedHeaders: ["token"]})) // if we want to allow anyone then just use "*" // we allow only that server can see the header  I mean token
// after we create our build and deploy our application we don't need to cors anymore


//config multer package
//const upload = multer({dest: "upload/"}) // we need to say where it will store images
    // we will get multi part data
    // its external middleware
    // we don't have the extension for the files inside the upload folder
//if we want to set the destination then we need to use diskStorage
// setup multer diskStorage
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        let fullPath = "./upload"
        cb(null,fullPath) // first is error. so there is no error for us
    },
    filename: function (req,file,cb){
        //we can write condition here like if the file type is this show this like that.
        //let fileName = new Date().getTime()+ file.originalname // we can see keys belongs to file object in createUser I printed
        //let fileName = Date.now()+ "_" +file.originalname
        let fileName = Date.now() + file.originalname
        cb(null,fileName)
    }
})
const upload = multer({storage: storage}) // to see image inside the db we need to create a field for image in schema


// serve static files/pages
app.use(express.static("upload"))

// serve static files in views/build folder
app.use(express.static("views/build")) // now it serves our app.
//if we make changes in our react application these are not going to be updated automatically we need to copy paste our build folder again here and overwrite the old one because now build folders are separated from each other
// to serve our clients side routing
app.get("/",(req,res)=> {
    res.sendFile("./views/build/index.html", {root:"."})
    // we have blank page and it says unexpected token which is coming from main.js in build.we don't have any route like /static./js/main.... . we can tell our application whenever it takes request from static folder run it. for it we need to add above code.
}) 

//Customer middleware

//function log(req,res,next){
//    console.log("I am a middleware")
//    //it will stay here, holding request here. we need to use next
//    
//    //next("hello") // when we not pass hello here we got page not found page.with hello we are getting error from universal error handling. whatever we pass inside the next is error.we are forwarding request along with the error. this means we pass t things error and request. normal error handling cannot get error, two things, it just gets request. so universal error handler handle it.
//
//    next()
//
//} // how we can use that middleware? app.use(log). it just printing this console message whenever we will get request. 
//
//function checkMethod(req,res,next){
//
//    console.log("I am second middleware")
//    //without next here request will be hold here and we cannot see third middleware
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
//app.use("/middleware",log, checkMethod, thirdMiddleware) // we can also add a condition here with /middleware .
//app.use(log, checkMethod, thirdMiddleware) // sync code also work from left to right. 
//app.use([log, checkMethod, thirdMiddleware]) //we can wrap them into array. it will work like as before. what is the purpose? these are the same collection of code. its the way to organize them. express can understand that and execute them one by one. and we can pass another array and specify their purposes like:  app.use([log, checkMethod, thirdMiddleware], [validateemail, validateuser])


// MVC Architecture
// Models (for databases/ data storage) - Views (UI, frontend, presentational data) - Controllers (request handlers, logic)
// We want/have to organize our code. 

// Routes
// urls' endpoints that we can send specific request. we can sen only get request. with post request we can send password username etc. by creating form. we cannot test it with thunderClient, postman or other application

// Route GET "/"
//app.get("/",  (req,res, next)=> {
//
//    console.log("I am in the middle");
//    //res.send("Response from middleware") // here we are ending RRC cycle. we suppose to just printout message for server and just next.
//    next(); // I am forwarding it to next controller. Cycle shouldn't be end here.
//
//    // we can also add second middleware
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
//    // on the backend site we cannot see this request. This is why we have morgan package. 
//
//    res.send("I am done")
//
//}) // responsible to handle get request. (1-endpoint, 2-request handler/ controller). and req and res should be in same sequence/order always.

// morgan provides middleware. Middleware which is a function which will execute between req and res cycle and has third argument next function to forward request to next middleware. Middleware is a function that get request before controller and send it to controller. how we send forward this request ? by using next function. we can also add next function to the function that we are going to end RRC. Its totally okay, all functions are middleware in express. GO and check above

//Routes we will create:
// "/users" GET POST PATCH DELETE // upload.single will attached req.file
//app.use(usersRoute); 
app.use("/users",upload.single('image'), usersRoute); // for example here we have custom middleware and we are using it directly without calling
//array is for more then one image or file, single is for one. the name of the input in frontend should be same what we use in backend.so name should be image in frontend. 
// we should go to createUser but first we went to the and create a user with image. we need to use form data and select files option. and under files we used image the same name that we use here

//app.use("/users",log,usersRoute); if use log here then when endpoint is users it will jump log, since we have next in log then it will jump userRoute not to second middleware(checkMethod). with this method we are going to authenticate our users, and other security purposes

// "/records" GET POST PATCH DELETE
//app.use(recordsRoute);
app.use("/records",recordsRoute);

// "/orders" GET POST PATCH DELETE
//app.use(ordersRoute);
app.use("/orders",ordersRoute);
//app.use("/orders",verifyToken, ordersRoute);


// if we don't specify endpoint here then it will travel through the files till it finds the conditions regarding endpoints For example we have request for orders then it will check first usersroute file and check all methods and conditions and then will come back to app.js and go through with recordsroute file and does same thing and then will go through with the ordersroute and then find it so it is wasting of time.
// if we specify our endpoint here then we don't need to specify it in routes files.


// if we have route that specified above then express will send 404 error. Instead of express we will handle this error. we can send anything back to the user.

// handling 404 page not found error (error handling middleware)
//it should always be in the bottom because our code working from top to bottom
app.use( (req,res, next) => { // we are not using any endpoint because we should make it global.any endpoint we don't have then it will send this err message
    //res.json({success:false, message: "there is no such route"})
    res.sendFile("./views/pageNotFound.html", {root:"."})
    //res.status(404).sendFile("./views/pageNotFound.html", {root:"."}) // this status is for the developer. you can see it in the browser terminal.you can send any status.
} ) // this function not getting error. getting request. if we have next parameter for get rq in records and send err through with next (next(err) ) in catch block then this function will not get this err. 
//this middleware is responsible for handling errors for undefined routes

//other then 404 page.
//universal error handler middleware
// request along with an error enters into this middleware
app.use((err, req, res, next)=> { // this middleware receiving error. thats because its called universal error handler.

    // res.json({success:false, message: err.message})
    // res.json({success:false, message: err}) // to see error message from validator

    // we add err status so it should be:
    //res.status(err.status).json({success:false, message: err.message})
    //since we add status here to universal error handler we need to add this to all controllers to prevent it:
    res.status(err.status || 500);
    res.json({success:false, message: err.message})


}) // this is responsible for handling any errors coming from mongo, authentication, authorization, validation... from different places


// listening request on port 4000
app.listen(PORT, () => console.log("server is running on port", PORT))