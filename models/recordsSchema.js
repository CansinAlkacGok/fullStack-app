import mongoose from 'mongoose'

const Schema = mongoose.Schema
// this is class. 
// schema is structure of your document

// document structure
const recordSchema = new Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    year: {type: Number, required: true},
    img: {type: String, required: true},
    price: {type: Number, required: true}
    // for example if we want to create options for choosing currency then we need to create currency here and give type Enum and tehn give values variable which is array and includes currency options
})

// now we need to create Collection and store this document
// create Collection and store such type of documents in that collection

const RecordsCollection = mongoose.model("records", recordSchema) // most developer say RecordsSchema

export default RecordsCollection;
