import mongoose, { Document as MongooseDocument } from "mongoose";
// file
// text
// number
// checkbox
// select box
// textarea
// radio button

// `skillhub-${1}`

interface IDocument extends MongooseDocument {
    profile: string;
    name: string;
    age: string;
    address: string;
    birthDate: string;
    role: string;
    isVerified: boolean;
    gender: string;
    interests: string[];
}


const userSchema = new mongoose.Schema<IDocument>(
    {
        profile: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        age: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        birthDate: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        gender: {
            type: String,
            enum: ["male", "female"],
            required: true,
        },
        interests: {
            type: [String],
            // enum: ["sports", "music", "movies", "tech", "art"],
        },

    },
    { timestamps: true }
);

const Document = mongoose.model("documets", userSchema);
export default Document;
