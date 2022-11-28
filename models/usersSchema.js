import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema

//user document structure
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // rollNumber: {type:Number, required: true, unique: true}
    orders:[{type:Schema.Types.ObjectId, ref: "orders"}], // to see orders here we need to push orders to this array. so we need to change something in ordersController in createOrder function
    
    // to secure operations. this is authorization process. we can provide some permissions for some authorities
    //role:{type:String, enum: ["user","admin"], default: "user" } // enum provides us options. default is for if no role is defined. after finished project is we delete the admin here then all users will be users an then we can secure our site because no one can be admin anymore
    role:{type:String, enum: ["user","manager"], default: "user" },
    token:{type:String},
    profileImage: {type:String, default: function (){
         return `https://joeschmoe.io/api/v1/${this.firstName}` // we cannot see this image in upload folder because upload folder just store image from multer. we just created link for the profile image 
    }} // we got default value from https://joeschmoe.io/
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals:true
    }
   
}) // if we see the fullName inside the doc

// incase we want to create virtual property like fullName

userSchema.virtual("fullName").get(function(){
    return this.firstName + " " +  this.lastName
})

/* userSchema.virtual("domain").get(function(){
    return this.email.split("@")[1].split(".")[0]
}) */

// we are going hash password here
// he is recommending to hash password here in schema
userSchema.pre("save", function (next) {

    if(this.isModified("password")){
        // we can make function async and then add await to hashedPassword and use bcrypt.hash
        const hashedPassword = bcrypt.hashSync(this.password, 10)// this means user
        this.password = hashedPassword;
        // console.log("I am pre-Save middleware")
         console.log("password hashed and store into DB")
    }

        next();


    // There is a problem, maybe we want to update firstName its going to rehashed. this problem may fixed the version we are using for mongoose. but if we have this problem in further

    //In addition to above, in 6th day we need to save our user in ordersController while creating order. if we use findbyId and then use save method we need tho code below. but if we use findbyIDandUpdate method then we don't need to use it. since we save our user 

   // if (this.isModified("password")) {
   //     const hashedPassword = bcrypt.hashSync(this.password, 10)// this means user
   //     this.password = hashedPassword;
   //     // console.log("I am pre-Save middleware")
   //     console.log("password hashed and store into DB")
   //     next();
   // }

})// here we are listening the pre save event

//userSchema.pre("findOneAndUpdate",  function(next){
//
//    if(this.isModified("password")){ // is modified is not supported here
//        // we can make function async and then add await to hashedPassword and use bcrypt.hash
//        const hashedPassword = bcrypt.hashSync(this.password, 10)// this means user
//        this.password = hashedPassword;
//        // console.log("I am pre-Save middleware")
//         console.log("password hashed and store into DB")
//    }
//
//        next();
//
//})

userSchema.post("save", function () { // post-save is optional
    console.log("I am post-Save function")
    // we don't need next here because its end of the event
})

/* 
userSchema.methods.createToken = function (){
    //here we can create our method
} 
*/
// we also have static methods which built-in methods like findById and works with class?


// if we have above codes then we don't need to hashed Password in controller


const UsersCollection = mongoose.model("users", userSchema)

// we need to create index
UsersCollection.createIndexes({ email: -1 })
// because we have unique one and we can set index only if we have index other then that mongoose give index by default with _id

// we can also add another indexes if we want
// UsersCollection.createIndexes({email: -1, rollNumber: 1})

export default UsersCollection;