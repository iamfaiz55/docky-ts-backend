import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";



export const userProtected = (req: Request, res: Response, next: NextFunction): any => {
    const { user } = req.cookies;

    if (!user) {
        return res.status(419).json({ message: "Session Expired" });
    }

    jwt.verify(user, process.env.JWT_KEY as string, (error: VerifyErrors | null) => {
        if (error) {
            console.log(error);
            return res.status(406).json({ message: "JWT Error", error: error.message });
        }



        next();
    });
};
