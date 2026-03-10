import express from "express";
import { getAllUsers, addUser, updateUser, deleteUser, changeUserPassword, forceResetUserPassword } from "../../controllers/admin/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.put("/change-password/:id", changeUserPassword);
router.put("/force-reset-password", forceResetUserPassword);
export default router;
