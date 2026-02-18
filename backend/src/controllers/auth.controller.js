import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) {
        return res.status(409).json({ message: "Email is already registered!" });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const user = {
        name, email, password: hashPassword
    };

    const userData = await User.create(user);
    res.status(201).json({
        message: "User created successfully!",
        userData
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Email not found!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid credentials!" });
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

    res.status(200).json({
        message: "User logged in successfully!",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
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

export const getMe = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user!" });
    }

    return res.status(200).json({
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});
