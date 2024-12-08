import express from "express"
import * as authController from "../controllers/auth.controller"

const authRoute = express.Router()

authRoute
     .post("/register", authController.register)
     .post("/login", authController.login)
     .post("/logout", authController.logout)
     .post("/user-login", authController.UserLogin)
     .post("/user-logout", authController.userLogout)


export default authRoute