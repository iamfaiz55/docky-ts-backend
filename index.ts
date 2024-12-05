import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth.routes";
import docRoutes from "./routes/document.routes";
import { userProtected } from "./middleware/user.protected";
// import { userProtected } from "./middleware/user.protected";

dotenv.config();

const app = express();
app.use(cookieParser())
app.use(cors({
    origin: "https://docky-ts-frontend.vercel.app",
    // origin: "http://localhost:5173",
    credentials: true,
}));

const MONGO_URI = process.env.MONGO_URI || "";
mongoose.connect(MONGO_URI)

app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/doc", docRoutes)

// app.use("*", async (req: Request, res: Response) => {
//     res.status(404).json({ message: "Resource Not Found" });

// })
app.get("*", (req: Request, res: Response) => {
    res.redirect(`https://docky-ts-frontend.vercel.app/not-fount`);
});


mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED");

    app.listen(5000, () => {
        console.log("Server running");
    });

})










