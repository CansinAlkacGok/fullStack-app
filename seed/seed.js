import mongoose from 'mongoose';
import RecordsCollection from '../models/recordsSchema.js';
import {faker} from '@faker-js/faker';
import UsersCollection from '../models/usersSchema.js';

mongoose.connect("mongodb://127.0.0.1:27017/live-coding-record-shop", () => {
    console.log("connected to DB .....")
}) // this is just for the testing purposes.


async function addRecords() {

    const recordPromises = Array(20).fill(null).map(()=> { // we are creating array which is length is 20 and we are filling it with null values. With map we are creating 20 array  with record.

        const record = new RecordsCollection({
            title: faker.commerce.productName(),
            author: faker.name.fullName(),
            year: faker.date.past().getFullYear(),
            img: faker.image.image(),
            price: faker.commerce.price(),
        })

        return record.save() // we are returning promises
    })

    // after loop we can resolve it

    await Promise.all(recordPromises) // this all means resolve all the promises
    mongoose.connection.close()
}

//addRecords();


async function addUsers() {

    const userPromises = Array(20).fill(null).map(()=> { // we are creating array which is length is 20 and we are filling it with null values. With map we are creating 20 array  with record.

        const user = new UsersCollection({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        })

        return user.save() // we are returning promises
    })

    // after loop we can resolve it

    await Promise.all(userPromises) // this all means resolve all the promises
    console.log("20 users stored in DB")
    mongoose.connection.close()
}

addUsers();

// for order
/* 
const order = new OrdersCollection({
    records: [faker.datatype.number(),..and you can add more] maybe like: 
    records: [Array(20).fill(faker.datatype.number())]?
})
*/