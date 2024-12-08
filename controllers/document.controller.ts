import { Request, Response } from "express";
// import upload from "../utils/upload";
import Document from "../models/Document";
import cloudinary from "../utils/cloudinary";
import upload from "../utils/upload";
import Todo from "../models/Todo";
import { socketServer } from "../index";
// import { Server } from "socket.io";


export const addDoc = async (req: Request, res: Response): Promise<any> => {
    try {



        upload(req, res, async () => {
            const { userName, password, age, address, birthDate, role, isVerified, gender, interests, userId } = req.body;
            console.log("req.body", req.body);

            let profileUrl: string | undefined;
            if (req.file) {
                try {
                    const { secure_url } = await cloudinary.uploader.upload(req.file.path);
                    profileUrl = secure_url;
                } catch (cloudinaryError) {
                    return res.status(500).json({ message: "Cloudinary upload failed", error: cloudinaryError });
                }
            }
            // let x = JSON.parse(interests)
            // console.log("interests", x);

            await Document.create({
                userName,
                password,
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

            const { age, address, birthDate, role, isVerified, gender, interests, userId, userName, password } = req.body;
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
                    userName,
                    password,
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


export const addTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { task, desc, uId, isDone } = req.body;

        // Create a new Todo
        const newTodo = new Todo({
            task,
            desc,
            uId,
            isDone
        });

        const savedTodo = await newTodo.save();

        const allTodos = await Todo.find({ uId });

        socketServer.emit("send", allTodos);

        // Send the response with the saved Todo
        res.status(201).json({ message: "Todo created successfully", result: savedTodo });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
};

export const getTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params
        const x = await Todo.find({ uId: id })
        console.log("id", id);
        console.log("x", x);

        socketServer.emit("send", x);
        res.json({ message: "Todo get Success", result: x })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });

    }
}

export const completeTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params
        const x = await Todo.findByIdAndUpdate(id, { isDone: true })
        // socketServer.emit("send", x);
        res.json({ message: "Todo complete Success", result: x })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
}


export const userUpdate = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const user = await Document.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        upload(req, res, async () => {
            try {
                console.log("req.body", req.body);

                let newImgUrl: string | undefined;

                // If a file is uploaded, handle image replacement
                if (req.file) {
                    // Delete the existing image from Cloudinary, if it exists
                    if (user.profile) {
                        try {
                            const publicId = user.profile.split('/').pop()?.split('.')[0];
                            if (publicId) {
                                await cloudinary.uploader.destroy(publicId);
                            }
                        } catch (deleteError) {
                            return res.status(500).json({ message: "delete error", });
                        }
                    }

                    const { secure_url } = await cloudinary.uploader.upload(req.file.path);
                    newImgUrl = secure_url;
                }

                const updatedUser = await Document.findByIdAndUpdate(
                    id,
                    {
                        ...req.body,
                        profile: newImgUrl || user.profile,
                    },
                );

                return res.status(200).json({
                    message: "User updated successfully",
                    user: updatedUser,
                });
            } catch (error) {
                console.error("Error during update:", error);
                return res.status(500).json({ message: "Something went wrong", error });
            }
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};