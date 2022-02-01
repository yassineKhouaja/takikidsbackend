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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - userName
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         userName:
 *           type: string
 *           description: The userName of the user
 *       example:
 *         email: foulenbenfoulen@gmail.com
 *         password: foulen1234
 *         userName: foulenbenfoulen
 */

/**
 * @swagger
 * tags:
 *   name: authentification
 *   description: user authentification
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: create new user
 *     tags: [authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
