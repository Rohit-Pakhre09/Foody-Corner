import Receipe from "../models/Receipe.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const getAllReceipe = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user!" });
    }

    const data = await Receipe.find({ user: req.user._id });

    res.status(200).json({ message: "Your receipe fetched successfully!", data });
});

export const getAllReceipeAdmin = asyncHandler(async (_req, res) => {
    const data = await Receipe.find().populate("user", "name email role");
    res.status(200).json({ message: "All receipe fetched successfully!", data });
});

export const createReceipe = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user!" });
    }

    const data = await Receipe.create({ title, content, user: req.user._id });
    res.status(201).json({ message: "Receipe added successfully!", data });
});

export const updateReceipe = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!id) {
        return res.status(404).json({ message: "ID is not provided!" });
    }
    if (!title || !content) {
        return res.status(400).json({ message: "All fields are required!" })
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user!" });
    }

    const receipe = await Receipe.findById(id);
    if (!receipe) {
        return res.status(404).json({ message: "Receipe not found!" });
    }

    const isOwner = receipe.user?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Forbidden! You cannot update this receipe." });
    }

    receipe.title = title;
    receipe.content = content;
    const data = await receipe.save();

    res.status(200).json({ message: "Receipe updated successfully!", data });
});
