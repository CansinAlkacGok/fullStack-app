import OrdersCollection from "../models/ordersSchema.js"
import UsersCollection from "../models/usersSchema.js"

export const getAllOrders = async (req,res,next) => {

    // const Orders = await OrdersCollection.find() // asyncrnous. with await we can keep it till to get all Orders and then our syncronous will not be undefined because await keeping and avoiding to print next line
 
     // whenever we us async await its recommended to try catch block 
 
     try{
         //const orders = await OrdersCollection.find();
         const orders = await OrdersCollection.find().populate("records","-id -title -year").populate("userId", "-email -password -__v") // we are populating records. its going through orders collection and find and pick data according to the id. here, we need to use the name of the property in schema. if we want to exclude something we need to pass second argument in populate method. for deselect need to add "-" before properties
         // we couldn't deselect the email because we had virtual for domain by using email with split method in userschema. so we needed to comment it out then we can deselect email. couldn't execute fullName also but not got an error like as email before.
         res.json(orders)
     }catch(err){
        // res.json({success:false, message: err.message}) // Connection was forcibly closed by a peer.
        next(err)
     }
 
    // res.send("Received get request on Orders")
    //res.json(Orders) // synchronous 
 }
 
 export const getSingleOrder = async(req,res, next) => {
 
     //res.send("we have received get request for single Order.")
 
     // "/Orders/:id"
 
     try{
         //const {id} req.params
         const id = req.params.id
         const singleOrder = await OrdersCollection.findById(id)
         //now we need to check some conditions. if we don't have any Orders we cannot send null value to the user
         res.json({success:true, order: singleOrder})    
     }
     catch(err){
         //res.json({success:false, message: "Order doesn't exist"})
 
         //const error = new Error("Order doesn't exist")
         //res.json({success:false, message: error.message})
         next(err)
     }
     
     
 }
 
 export const createOrder = async (req,res,next) => {

    try{    
     
     //res.send("Received post request on Orders")
 
     //POST request to create OrderonClick={()=> deleteOrder(order._id)}}

         //console.log(req.body);//undefined. we are not getting what we typed to thunderClient. we need to add express json middleware in app.js to parse any incoming json data. after that we got the data above in the terminal
     
         const order = new OrdersCollection(req.body)
         await order.save() // we need to save the data because this is the promise and if we send response then we cannot save it so fist save it.
         //res.json({success:true, order: order})

         //to push orders in orders array in usersSchema in users collection
         //const user = await UsersCollection.findById(order.userId);
         //user.orders.push(order._id)
         //await user.save()
         //or
         //we updated user as updatedUser. Now we want to populate/show orders in the profile
         const updatedUser = await UsersCollection.findByIdAndUpdate(order.userId, {$push: {orders: order._id}}, {new:true}).populate("orders") // after  populate we will not have id anymore but complete information 

         res.json({success:true, data: updatedUser}) // when we check database we are seeing it at the Orders collection
     }
     catch(err){
        // res.json({success:false, message: err.message})
        next(err)
     }
 
 }
 
 export const updateOrder = async(req,res,next) => {
     //res.send("Received patch request on Orders")
 
     //Patch request /Orders/:id
 
     try{
 
         const id = req.params.id;
         const updatedOrder = await OrdersCollection.findByIdAndUpdate(id, req.body, {new:true} ) // this function do 2 things finding and updating but we want to get updated one so we need to pass 3 param
         // in thunder client we are passing {price: "1400"} to update the price by passing localhost:4000/Orders/6368ccc6a0abd7540f5d3a21
 
         res.json({success:true, order: updatedOrder})
 
         // we don't need to save it. its going to save automatically. we just need to save it when we post new document.
 
     }
     catch(err){
        // res.json({success:false, message: err.message})
        next(err)
     }
 
 }
 
 export const deleteOrder = async(req,res,next) => {
     //res.send("Received delete request on Orders")
 
     //Delete request /Orders/:id
 
     try{
         const {id} = req.params
        // const deletedItem = await OrdersCollection.findByIdAndDelete(id) // We get deleted item 
        // const deletedItem = await OrdersCollection.findByIdAndRemove(id) // it also gives deleted item back.both are the same.
         // with above methods are not throwing error if we have not this id.
 
         const existingOrder = await OrdersCollection.findById(id)
 
         if(existingOrder){
             const deletedStatus = await OrdersCollection.deleteOne({_id: existingOrder._id})
             
             //delete order from user orders as well
             //const updatedUser = await UsersCollection.findByIdAndUpdate(req.user._id, {$set: {orders: req.user.orders.filter(item=> item._id !== id)}}, {new:true}).populate("orders")
             //const updatedUser = await UsersCollection.findByIdAndUpdate(req.user._id, {$set: {orders: user.orders.filter(item=> item._id !== existingOrder.id)}})

             const updatedUser = await UsersCollection.findByIdAndUpdate(req.user._id, {$pull: {orders: id}}, {new:true}).populate({path: "orders", populate: {path: "records", model: "records"}}) // it will delete the item from orders array. its going to delete specific id in orders array

             res.json({success:true, data: updatedUser})
         }else {
             //res.json({success:true, status: existingOrder})
             throw new Error("Order id doesn't exist!") // this error catches by catch block. so we see this message in catch block's error message
         }
 
     }
     catch(err){
        // res.json({success:false, message: err.message}) 
        next(err)
     }
 }