import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_KEY || "";
export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ name, email, password: hashedPassword });



        return res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        // console.log("new", req.body);


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        console.log(user);


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        console.log(isPasswordValid);

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.cookie("user", token, {
            maxAge: 86400000,
            httpOnly: true,
            secure: false,

        });
        return res.status(200).json({ message: "Login successful", result: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
    res.clearCookie("user");
    return res.json({ message: "Logout successful." });
};


