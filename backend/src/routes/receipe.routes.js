import express from "express";
import { createReceipe, deleteReceipe, getAllReceipe, getAllReceipeAdmin, updateReceipe } from "../controllers/receipe.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";

const router = express.Router();

router.get("/", (_req, res) => {
    res.status(200).json({ message: "Receipe API is working!" });
});

router.get("/receipes", verifyJWT, getAllReceipe);
router.get("/receipes/admin", verifyJWT, requireRole("admin"), getAllReceipeAdmin);
router.post("/", verifyJWT, requireRole("admin", "user"), createReceipe);
router.put("/:id", verifyJWT, requireRole("admin", "user"), updateReceipe);
router.delete("/:id", verifyJWT, requireRole("admin", "user"), deleteReceipe);

export default router;
