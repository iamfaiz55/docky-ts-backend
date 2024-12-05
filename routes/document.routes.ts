import express from "express"
import * as  docCont from "../controllers/document.controller"

const docRoutes = express.Router()

docRoutes
    .post("/add-doc", docCont.addDoc)
    .get("/getAllDoc", docCont.getAllDoc)
    .put("/update-doc/:id", docCont.updateDoc)
    .delete("/delete-doc/:id", docCont.deleteDoc)


export default docRoutes