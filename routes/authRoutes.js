import express from "express";
import {
  register,
  login,
  updateUser,
  updateUserAdmin,
  deleteUserAdmin,
  allUsers,
  deleteUser,
} from "../controllers/authController.js";
import authenticateUser, { restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.use(authenticateUser);
router.route("/").patch(updateUser).delete(deleteUser);

router.use(restrictTo("admin"));
router.route("/").get(allUsers);

router.route("/:id").post(updateUserAdmin).delete(deleteUserAdmin);

export default router;
