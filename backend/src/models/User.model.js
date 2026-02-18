import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    email: {
        unique: true,
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    refreshToken: {
        type: String,
        trim: true,
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;