import express from 'express'
import { createOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrder } from '../controllers/ordersController.js';
import verifyToken from '../middlewares/authenticationVerification.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';

const route = express.Router();
//we need to create route here and no need to change app with route variable to avoid any issues because of importing or exporting things.

//GET "/orders"
route.get("/", verifyToken, isAdmin, getAllOrders)

//GET "/orders/:id" to get single record . "/:id" is parameter, params. we have :id to make our route dynamic then we don't need to create route for every order or records or users. 
route.get("/:id", verifyToken, getSingleOrder)

//POST "/orders"
route.post("/", verifyToken, createOrder)

// PATCH "/orders/:id"
route.patch("/:id", verifyToken, updateOrder)

//DELETE "/orders/:id"
route.delete("/:id", verifyToken, deleteOrder)

//here we have verifyToken for all route so we can add verify token directly in app.js insteaD OF ADDING HERE 5 TIMES

export default route;