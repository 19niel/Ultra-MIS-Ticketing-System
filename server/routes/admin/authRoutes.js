import express from "express";
import {login, me, logout } from "../../controllers/admin/authController.js"

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout); // ✅ add this
router.get("/me", me);

export default router;
