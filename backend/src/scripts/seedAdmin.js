import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "../config/connectDB.js";
import User from "../models/User.model.js";

const seedAdmin = async () => {
    const name = process.env.ADMIN_NAME || "admin";
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("All fields are required!");
    }

    await connectDB(process.env.DB_URI);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (existingUser.role !== "admin") {
            existingUser.role = "admin";
            await existingUser.save();
            console.log(`User ${email} addded.`);
        } else {
            console.log(`Admin already exists for ${email}.`);
        }
        return;
    }

    const hashPassword = await bcrypt.hash(password, 12);
    await User.create({
        name,
        email,
        password: hashPassword,
        role: "admin"
    });

    console.log(`Admin seeded successfully: ${email}`);
};

seedAdmin()
    .catch((error) => {
        console.error("Admin seeding failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close();
    });
