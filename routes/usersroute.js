import express from 'express'
import { getAllUsers,getSingleUser, createUser, updateUser, deleteUser, loginUser, checkUserToken } from '../controllers/usersController.js';
import {body, check} from 'express-validator';
import { usersValidation } from '../middlewares/validationMiddleware.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';
import verifyToken from '../middlewares/authenticationVerification.js';
//because we want to check body


const route = express.Router();
//we need to create route here and no need to change app with route variable to avoid any issues because of importing or exporting things.

// we need to organize these routes files. need to organize controllers.

//GET "/users"
//route.get("/users", (req,res) => {
//    res.send("Received get request on users")
//})

// which route we want to protect. then we can add isAdmin middleware between endpoint and controller

route.get("/", verifyToken, isAdmin, getAllUsers)

//Route POST "/users/login"
route.post("/login", loginUser)

//checkusertoken Route GET
route.get("/checkusertoken", checkUserToken)

//GET "/users/:id" to get single record
route.get("/:id",  verifyToken, isAdmin, getSingleUser)

//POST "/users"
//route.post("/users", (req,res) => {
//    res.send("Received post request on users")
//})

//route.post("/",body("firstName").exists().trim().isLength({max:20}).withMessage("Please provide us with your first name"), createUser) // before sending to createUser we need to check body. body is external middleware so we need to call it with parenthesis. I want to check fistName. and then we have validation chaining api process here. if user nor provide firstname we can also add error message with withMessage. we will send this messahe to universal error handler later. but maybe user write something pofjpjfcepojfceopwjopwej so firstname is exist but error is because of length so we should create a message for it also. so below

//route.post("/",body("firstName").exists().trim().withMessage("Please provide us with your first name").isLength({max:20}).withMessage("maximum length of first name should be 20", createUser))

// if there is an error we are getting this error message from mongoose.

//we can use check also to validate cookies, headers,params and query not only the body. body method only check req.body
route.post("/", usersValidation, createUser) // instead write all validations here we can create other folder and store them there




// PATCH "/users/:id"
//route.patch("/users/:id", (req,res) => {
//    res.send("Received patch request on users")
//})

route.patch("/:id", verifyToken, isAdmin, updateUser)

//DELETE "/users/:id"
//route.delete("/users/:id", (req,res) => {
//    res.send("Received delete request on users")
//})

route.delete("/:id", verifyToken, isAdmin, deleteUser)

export default route;
// we need to export route object