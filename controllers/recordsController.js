import RecordsCollection from "../models/recordsSchema.js"

export const getAllRecords = async (req,res , next) => {

   // const records = await RecordsCollection.find() // asyncrnous. with await we can keep it till to get all records and then our syncronous will not be undefined because await keeping and avoiding to print next line

    // whenever we us async await its recommended to try catch block 

    try{
        const records = await RecordsCollection.find();
        res.json(records)
    }catch(err){
       // res.json({success:false, message: err.message}) // Connection was forcibly closed by a peer.
       next(err)
    }

   // res.send("Received get request on records")
   //res.json(records) // synhronous 
}

export const getSingleRecord = async(req,res, next) => {

    //res.send("we have received get request for single record.")

    // "/records/:id"

    try{
        //const {id} req.params
        const id = req.params.id
        const singleRecord = await RecordsCollection.findById(id)
        //now we need to check some conditions. if we don't have any records we cannot send null value to the user
        res.json({success:true, record: singleRecord})    
    }
    catch(err){
        //res.json({success:false, message: "Record doesn't exist"})

        //const error = new Error("Record doesn't exist")
        //res.json({success:false, message: error.message})
        next(err)
    }
    
    
}

export const createRecord = async (req,res, next) => {
    
    //res.send("Received post request on records")

    //POST request to create record

    try{
        // user will send object so json data
        /* 
        {
             "title": "iphone 10",
             "author": "Apple",
             "price": "1700",
             "img": "http://image.com",
             "year": 2022
        }
        */

        //console.log(req.body);//undefined. we are not getting what we typed to thunderClient. we need to add express json middleware in app.js to parse any incoming json data. after that we got the data above in the terminal
        
        const record = new RecordsCollection(req.body)
        //we need to check if any file coming with req
        if(req.file){
            record.img = `/${req.file.filename}`
        }
        await record.save() // we need to save the data because this is the promise and if we send response then we cannot save it so fist save it.
        //res.json({success:true, record: record})
        //res.json({success:true, record}) // when we check database we are seeing it at the records collection
        res.json({success:true, data: record})
    }
    catch(err){
        //res.json({success:false, message: err.message})

        next(err)
    }

}

export const updateRecord = async(req,res, next) => {
    //res.send("Received patch request on records")

    //Patch request /records/:id

    try{

        const id = req.params.id;
        const updatedRecord = await RecordsCollection.findByIdAndUpdate(id, req.body, {new:true} ) // this function do 2 things finding and updating but we want to get updated one so we need to pass 3 param
        // in thunder client we are passing {price: "1400"} to update the price by passing localhost:4000/records/6368ccc6a0abd7540f5d3a21

        res.json({success:true, record: updatedRecord})

        // we don't need to save it. its going to save automatically. we just need to save it when we post new document.

    }
    catch(err){
        //res.json({success:false, message: err.message})
        next(err)
    }

}

export const deleteRecord = async(req,res,next) => {
    //res.send("Received delete request on records")

    //Delete request /records/:id

    try{
        const {id} = req.params
       // const deletedItem = await RecordsCollection.findByIdAndDelete(id) // We get deleted item 
       // const deletedItem = await RecordsCollection.findByIdAndRemove(id) // it also gives deleted item back.both are the same.
        // with above methods are not throwing error if we have not this id.

        const existingRecord = await RecordsCollection.findById(id)

        if(existingRecord){
            const deletedStatus = await RecordsCollection.deleteOne({_id: existingRecord._id})
            res.json({success:true, status: deletedStatus})
        }else {
            //res.json({success:true, status: existingRecord})
            throw new Error("record id doesn't exist!") // this error catches by catch block. so we see this message in catch block's error message

           
        }

    }
    catch(err){
        //res.json({success:false, message: err.message}) 
        next(err)
    }
}