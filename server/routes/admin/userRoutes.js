import express from "express";
import { getAllUsers, addUser, updateUser, deleteUser, changeUserPassword } from "../../controllers/admin/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.put("/change-password/:id", changeUserPassword);

export default router;
