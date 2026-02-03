import express from "express";
import { getAllUsers } from "../../controllers/admin/userController.js";

const router = express.Router();

router.get("/", getAllUsers);

export default router;
