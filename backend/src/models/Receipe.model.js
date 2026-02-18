import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    content: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
    }
}, { timestamps: true });

const Receipe = mongoose.model("Receipe", receiptSchema);
export default Receipe;