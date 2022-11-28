import express from 'express'
import { createRecord, deleteRecord, getAllRecords, getSingleRecord, updateRecord } from '../controllers/recordsController.js';
import verifyToken from '../middlewares/authenticationVerification.js';
import { isAdmin } from '../middlewares/isAdminMiddleware.js';

const route = express.Router();
//we need to create route here and no need to change app with route variable to avoid any issues because of importing or exporting things.

//GET "/records"
route.get("/" ,getAllRecords)

//GET "/records/:id" to get single record
route.get("/:id", getSingleRecord)

//POST "/records"
route.post("/", verifyToken, isAdmin, createRecord)

// PATCH "/records/:id"
route.patch("/:id", verifyToken, isAdmin, updateRecord)

//DELETE "/records/:id"
route.delete("/:id", verifyToken, isAdmin, deleteRecord)

export default route;