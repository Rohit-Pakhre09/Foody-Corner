import express from "express";
import { getMe, login, logout, register } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "Auth API is working" });
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getMe);

export default router;
