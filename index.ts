import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth.routes";
import docRoutes from "./routes/document.routes";
import { Server } from "socket.io";
import Todo from "./models/Todo";

dotenv.config();

const PORT: number = parseInt(process.env.PORT || "5000", 10);
const MONGO_URI = process.env.MONGO_URI || "";

const app = express();
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// MongoDB connection
mongoose.connect(MONGO_URI);

mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED");
});

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/doc", docRoutes);

export const io = http.createServer(app);
export const socketServer = new Server(io, {
    cors: {
        origin: "http://localhost:5173",
    },
});

socketServer.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);



    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});


// Handle unknown routes
app.get("*", (req: Request, res: Response) => {
    res.redirect("http://localhost:5173/not-found");
});

// Start the server
io.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
