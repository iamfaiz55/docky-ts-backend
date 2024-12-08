import express from "express"
import * as  docCont from "../controllers/document.controller"

const docRoutes = express.Router()

docRoutes
    .post("/add-doc", docCont.addDoc)
    .get("/getAllDoc", docCont.getAllDoc)
    .get("/get-todo/:id", docCont.getTodo)
    .post("/add-todo", docCont.addTodo)
    .put("/update-doc/:id", docCont.updateDoc)
    .put("/complete-todo/:id", docCont.completeTodo)
    .put("/update-user/:id", docCont.userUpdate)
    .delete("/delete-doc/:id", docCont.deleteDoc)


export default docRoutes