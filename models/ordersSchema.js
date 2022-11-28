import mongoose from 'mongoose'

const Schema = mongoose.Schema


//order document  structure
const orderSchema = new Schema({
   //records: {type: Array, required: true}
   // records: [{type: String, required: true}],
   //recordsIds are not normal string they are object ids belonging to records collection
    records: [ {type: Schema.Types.ObjectId , ref:"records", required: true} ],
    totalPrice: {type: Number, required: true},
    //later we will create here userId to see which user send this order.
    //how we can know that which order belong to which user. so we need to add users id here also
    //userId: {type:String, required:true}
    //userIds are not normal string they are object ids belonging to users collection
    userId: {type:Schema.Types.ObjectId, ref:"users", required:true}, 
    //embedded document.we can also follow embeeded doc way like below, right now we are using reference document model
    /* message:[
        {text: "hello"},
        {}
    ] */
})

// we will just send id to the server

// we have issue. how can we understand by using id what is the order? which product user ordered? we should make relationship between different collections. we should create one to one relationship between user and order collections. but user can place multiple orders. then it will become one to many relationship because with multiple orders one user create more then one order doc. each order we have records collections. between order and records we also have one to many. from order to user direction and for each order we have one to one again. those are the different type of relationships. we need to remove string type in records property and say mongoose take it as a objectID. ITS NOT NORMAL STRING ITS OBJECTID. where those ids are? we need to add ref and indicate name of the collection. Also do it for userId.

/* what we pass 
{
  "records":["63639e2a1791de8a73e70cfc", "63639e2a1791de8a73e70cf9"],
  "totalPrice": 700,
  "userId": "636b878dcccf2ee2cfb0fc4b"
}
*/

/* what we get same output. now we should change something in orderscontroller and go to get all orders function and populate records and user
{
  "success": true,
  "order": {
    "records": [
      "63639e2a1791de8a73e70cfc",
      "63639e2a1791de8a73e70cf9"
    ],
    "totalPrice": 700,
    "userId": "636b878dcccf2ee2cfb0fc4b",
    "_id": "636cb9043787c547fe810001",
    "__v": 0
  }
}
*/

const OrdersCollection = mongoose.model("orders", orderSchema)

export default OrdersCollection;

