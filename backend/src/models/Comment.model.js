import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const Comments = mongoose.model("Comments", commentSchema);
export default Comments;