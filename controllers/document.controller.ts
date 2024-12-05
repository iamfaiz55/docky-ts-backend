import { Request, Response } from "express";
// import upload from "../utils/upload";
import Document from "../models/Document";
import cloudinary from "../utils/cloudinary";
import upload from "../utils/upload";


export const addDoc = async (req: Request, res: Response): Promise<any> => {
    try {



        upload(req, res, async () => {
            const { name, age, address, birthDate, role, isVerified, gender, interests, userId } = req.body;
            console.log("req.body", req.body);

            let profileUrl: string | undefined;
            if (req.file) {
                try {
                    // Upload to cloudinary
                    const { secure_url } = await cloudinary.uploader.upload(req.file.path);
                    profileUrl = secure_url;
                } catch (cloudinaryError) {
                    return res.status(500).json({ message: "Cloudinary upload failed", error: cloudinaryError });
                }
            }
            // let x = JSON.parse(interests)
            // console.log("interests", x);

            await Document.create({
                name,
                age,
                address,
                birthDate,
                role,
                isVerified,
                gender,
                interests,
                userId,
                profile: profileUrl,
            });

            return res.json({ message: "Document added successfully" });
        })

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error });
    }
};

export const getAllDoc = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await Document.find()

        return res.json({ message: "All Document Fetch successfully", result });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};



export const updateDoc = async (req: Request, res: Response): Promise<any> => {
    try {
        upload(req, res, async (err: any) => {
            if (err) {
                return res.status(400).json({ message: "File upload failed", error: err.message });
            }
            console.log("req.body---", req.body);

            const { age, address, birthDate, role, isVerified, gender, interests, userId, name } = req.body;
            const { id } = req.params;
            const existingDoc = await Document.findById(id);
            if (!existingDoc) {
                return res.status(404).json({ message: "Document not found" });
            }

            let updatedImage = existingDoc.profile;

            if (req.file) {
                if (existingDoc.profile!) {
                    const imageId = existingDoc.profile.split('/').pop()?.split('.')[0];
                    if (imageId) {
                        await cloudinary.uploader.destroy(imageId);
                    }
                }

                const { secure_url } = await cloudinary.uploader.upload(req.file.path);
                updatedImage = secure_url;
            }

            await Document.findByIdAndUpdate(
                id,
                {
                    name,
                    age,
                    address,
                    birthDate,
                    role,
                    isVerified,
                    gender,
                    interests,
                    userId,
                    profile: updatedImage,
                });

            return res.json({ message: "Document updated successfully" });
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};

export const deleteDoc = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        console.log("req.body", req.body);

        const existingDoc = await Document.findById(id);
        if (existingDoc) {
            if (existingDoc.profile) {
                const imagePublicId = existingDoc.profile.split('/').pop()?.split('.')[0];
                if (imagePublicId) {
                    await cloudinary.uploader.destroy(imagePublicId);
                }
            }
            await Document.findByIdAndDelete(id);
            return res.json({ message: "Document deleted successfully" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};