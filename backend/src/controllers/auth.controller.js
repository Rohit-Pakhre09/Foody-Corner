import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: "All fields are required!" });
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) {
        res.status(409).json({ message: "Email is already registered!" });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const user = {
        name, email, password: hashPassword
    };

    await User.create(user);
    res.status(201).json({ message: "User created successfully!", user });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!email) {
        res.status(404).json({ message: "Email not found!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        res.status(404).josn({ message: "Invalid credentials!" });
    }

    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );

    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({ messsage: "User logged in successfully!", user });
});

export const logout = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized user!" });
    }

    await User.findByIdAndUpdate(user._id, { $set: { refreshToken: null } });

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res.status(200).json({ message: "User logged out successfully!", user });
});
