import UsersCollection from "../models/usersSchema.js"
import {validationResult} from 'express-validator'
// this checks what is coming from middleware we created to check validation of data
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const getAllUsers = async (req,res, next) => {

    // const Users = await UsersCollection.find() // asynchronous. with await we can keep it till to get all Users and then our synchronous will not be undefined because await keeping and avoiding to print next line
 
     // whenever we us async await its recommended to try catch block 
 
     try{
         const users = await UsersCollection.find();
         res.json(users)
     }catch(err){

        // res.json({success:false, message: err.message}) // Connection was forcibly closed by a peer.
        next(err) // it sends req and error at the same time.
     }
 
    // res.send("Received get request on Users")
    //res.json(Users) // synchronous 
 }
 
 export const getSingleUser = async(req,res,next) => {
 
     //res.send("we have received get request for single User.")
 
     // "/users/:id"
 
     try{
         //const {id} req.params
         const id = req.params.id
         const singleUser = await UsersCollection.findById(id)
         //now we need to check some conditions. if we don't have any Users we cannot send null value to the user
         res.json({success:true, user: singleUser})    
     }
     catch(err){
         //res.json({success:false, message: "User doesn't exist"})
 
        // const error = new Error("User doesn't exist")
        // res.json({success:false, message: error.message})

        // for adding status code we also have external package: http-errors. But we are going to do it by ourselves
        //err.status = 404; 
        //console.log(err) // err is object and we add status to err object

        //or create new error
        const error = new Error ("id doesn't exist") // here we are overwriting the error message from error message from validator
        error.status = 404;

        next(error)
 
     }
     
     
 }
 
 //register user or sign up user
 export const createUser = async (req,res,next) => {
     
    console.log(req.file) // its to see multer data
    /* 
    {
      fieldname: 'image',
      originalname: 'britzergarden2.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'upload/',
      filename: '1c7ce60aefd4f5bf35af97ea2c76fb14',
      path: 'upload/1c7ce60aefd4f5bf35af97ea2c76fb14',
      size: 2151692
    }
    */

     //res.send("Received post request on Users")
 
     //POST request to create User
 
     try{
 
         //console.log(req.body);//undefined. we are not getting what we typed to thunderClient. we need to add express json middleware in app.js to parse any incoming json data. after that we got the data above in the terminal

          
        //if(req.body.firstName !== " "){} // like that but it means too many line codes

        // we can use validate middleware express provide instead :  npm i express-validator. go to routes

       // const result = validationResult(req) // if any err message to req then show this message in error handler. this message is coming from express-validator.
        //console.log(result)

        // we can write below code to avoid invalid data to database.
       // if(result.isEmpty()){
       //     const user = new UsersCollection(req.body)
       //     await user.save() // we need to save the data because this is the promise and if we send response then we cannot save it so fist save it.
       //     //res.json({success:true, user: user})
       //     res.json({success:true, user}) // when we check database we are seeing it at the Users collection
       // }else{
       //    next(result.errors) // with this in universal error handler should be : res.json({success:false, message: err})
       //    //next({message: result.errors}); // with this universal error handler should be : res.json({success:false, message: err.message}
       // }


        // since we add middleware to the userValidation and if there is okay we have next() to forward code here and execute below code. So we don't need to write codes like above with validationResult and if else conditions
        // const user = new UsersCollection(req.body)
        // await user.save()
        // res.json({success:true, user})


       // before storing user info into the database, hash user password
       // we can secure all users information with hash value. we have package for it: bcyrpt
       //Hashing password using bcrypt
       //bcrypt.hash asynchronous //or bcrypt.hashSync synchronous
       //bcrypt.compare asynchronous //or bcrypt.compareSync synchronous

        //const hashedPassword = await bcrypt.hash(req.body.password, 10 )// salt is numbers. salt means each number should encrypted with how many special character // The salt to be used in encryption. If specified as a number then a salt will be generated with the specified number of rounds and used

        //console.log(hashedPassword);
        //req.body.password = hashedPassword;
        
        // we can also do hash password inside the schema so I commented them out

       // since we add middleware to the userValidation and if there is okay we have next() to forward code here and execute below code. So we don't need to write codes like above with validationResult and if else conditions
        const user = new UsersCollection(req.body)
        //user.profileImage = `http://localhost:4000/${req.file.path}` // we can provide complete path.
        //its not possible to create hundred endpoiint to show image in browser. because when we create user with this we get http://localhost:4000/upload/1668509680575britzergarden2.jpg. so upload folder serve this static file. we need to add middleware for static pages or files in app.js
        //user.profileImage = `http://localhost:4000/${req.file.filename}` // we don't need to specify upload here because we have already had it in app.js where we used static thats why we had issue

        //
        if(req.file){
            user.profileImage = `http://localhost:4000/${req.file.filename}`
        }

        await user.save()
        console.log(user.fullName) // ali set 
        res.json({success:true, user})

       

     }
     catch(err){
        // res.json({success:false, message: err.message})
        next(err)
     }
 
 }

 
 export const updateUser = async(req,res, next) => {
     //res.send("Received patch request on Users")
 
     //Patch request /users/:id
 
     try{

        // we need to add something to get the changes file
        //first we need to find the user
        let user = await UsersCollection.findById(req.params.id)
        if(req.file){
            user.profileImage = `http://localhost:4000/${req.file.filename}`
        }

     

        //const updatedUser = await UsersCollection.findByIdAndUpdate(req.params.id, req.body, {new:true} ) // here we have issue with password when we tried to update our profile because we are sending empty password

         // we need to set/check our password manually otherwise we had issue
         if(req.body.password){
            user.password = req.body.password
         }

         //user = {...user, ...req.body} // we had issue with that so can be deleted
         await user.save()

        let body ={}// its empty because we have to select few value
        for(const key in req.body ){ // on other website they will take you another site to update your password but in our case we are doing all of them in the same page.
            if(req.body[key]!=="" && key !== "password"){// this should be used with we need to set our password note
                body[key] = req.body[key]
            }
        }

        const updatedUser = await UsersCollection.findByIdAndUpdate(req.params.id, body, {new:true} ).populate({path: "orders", populate: {path: "records", model: "records"}})
        //const updatedUser = await UsersCollection.findOneAndUpdate({_id: req.params.id}, {$set: body}, {new:true} )

         //const id = req.params.id;
         //const updatedUser = await UsersCollection.findByIdAndUpdate(id, req.body, {new:true} ) // this function do 2 things finding and updating but we want to get updated one so we need to pass 3 param
         // in thunder client we are passing {price: "1400"} to update the price by passing localhost:4000/Users/6368ccc6a0abd7540f5d3a21
 
         //res.json({success:true, user: updatedUser})
         res.json({success:true, data: updatedUser})
 
         // we don't need to save it. its going to save automatically. we just need to save it when we post new document.
 
     }
     catch(err){
        // res.json({success:false, message: err.message})
        next(err)
     }
 
 }// even if we pass just spaces for firstname and lastname and not valid email and one digit password it will add it. so we can add condition
 
 export const deleteUser = async(req,res,next) => {
     //res.send("Received delete request on Users")
 
     //Delete request /Users/:id
 
     try{
         const {id} = req.params
        // const deletedItem = await UsersCollection.findByIdAndDelete(id) // We get deleted item 
        // const deletedItem = await UsersCollection.findByIdAndRemove(id) // it also gives deleted item back.both are the same.
         // with above methods are not throwing error if we have not this id.
 
         const existingUser = await UsersCollection.findById(id)
 
         if(existingUser){
             const deletedStatus = await UsersCollection.deleteOne({_id: existingUser._id})
             res.json({success:true, status: deletedStatus})
         }else {
             //res.json({success:true, status: existingUser})
             throw new Error("User id doesn't exist!") // this error catches by catch block. so we see this message in catch block's error message
         }
 
     }
     catch(err){
        // res.json({success:false, message: err.message}) 
        next(err)
     }
 }

 export const loginUser = async(req,res,next) => {
    
    try{

        const user = await UsersCollection.findOne({email: req.body.email.toLowerCase()}).select("_id firstName lastName email password") // if we want to deselect we should add "-" before properties and then it will show others
        if(user){
            const check= await bcrypt.compare(req.body.password, user.password) 
            if(check){
                //creating certificate/token: authentication
                // we have package json.token.  npm i jsonwebtoken
                let token = jwt.sign({_id:user._id, firstName:user.firstName}, process.env.TOKEN_SECRET_KEY, {expiresIn: "50 days", issuer:"Cansin", audience: "students"})// we need to pass 2 argument.third one is optional. first argument in sign is payload(user's data). we can name properties whatever we want. second argument is signature/secret key.we need to keep it secure. instead of hard code here.better is to use it in env file
                //we can also add expiring date as a third argument.{expiresIn: "1h" /"24h"/"2 days"/"7d"/120 (means 120ms by default without string it is ms )}

                //we need to store this token in user data. we already create our schema we don't have token property inside there. we need to create on in schema
                // user.token = token;
                // await user.save()
                
                //but above has problem because of generating password

                const updatedUser = await UsersCollection.findByIdAndUpdate(user._id, {token:token}, {new:true}).populate({path: "orders", populate: {path: "records", model: "records"}})
                //const updatedUser = await UsersCollection.findByIdAndUpdate(user._id, {token:token}, {new:true}).select("-token")


                //res.json({success: true, data: user})

                //how we can send the token tot he response?

                //one way send to the body. but this is not the secure one. this way is not recommended
                //res.json({success: true, data: user, token:token})

                // we send to  localhost:4000/users/login
                /* 
                {
                  "email": "cansin@gmail.com",
                  "password": "1234"
                }
                */
               /* received
               {
                  "success": true,
                  "data": {
                    "_id": "636cd2ae3792b8bf911ff94d",
                    "firstName": "Cansin",
                    "lastName": "Alkac Gök",
                    "email": "cansin@gmail.com",
                    "password": "$2b$10$a6UbR1IzQ8nbx9Z4orY5X.pKUNdHDpGE4QVoIStoabLufaPwSvDp2",
                    "fullName": "Cansin Alkac Gök",
                    "id": "636cd2ae3792b8bf911ff94d"
                  },
                  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzZjZDJhZTM3OTJiOGJmOTExZmY5NGQiLCJmaXJzdE5hbWUiOiJDYW5zaW4iLCJpYXQiOjE2Njg0MTUyNjB9.y5BtU6H3_Fkb48jLbEyDRYwZlx0m_0hDap0dhv6axkI"
                }
               */

                //to decode your token you can go jwt.io and copy past your token and see the data
                //signature is securing our token

                //other way is: other then body we have header, we can attach it to the header.
                //res.header("token", token) //first argument is key second is our token
                //res.json({success: true, data: updatedUser})
                //or
                //res.header("authenticationCertificate", token).json({success: true, data: user})

                //this time we are not getting token in response body but in headers. 

                //we can attach in the cookies as well as a third way
                //res.cookie("token", token) 
                res.header("token", token)
                res.json({success: true, data: updatedUser})
                // we have set-cookies property in header this time and browser do everything instead of frontend developer. browser send cookie. we are storing in cookies this time
                // when we use cookie the expire time for that is session

            }else{
                throw new Error ("password doesn't match")
            }
        
        }else{
        throw new Error ("email doesn't exist")
        }
    }
    catch(err){
        next(err)
    }
}

export const checkUserToken = async (req, res,next) => {// we need async because we will get the data from database

    try{
        const token = req.headers.token // we are getting token // in req we have HEADERS!!!
        const payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY) // we verify our token

        const user = await UsersCollection.findById(payload._id).populate({path: "orders", populate: {path: "records", model: "records"}})

        res.json({success: true, data: user})
    }
    catch(err){
        next(err)
    }

}