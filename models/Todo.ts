import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        task: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        isDone: {
            type: Boolean,
            default: false,
        },
        uId: {
            type: mongoose.Types.ObjectId,
            ref: "documets"
        }
    },
    { timestamps: true }
);

const Todo = mongoose.model("todo", todoSchema);
export default Todo;
