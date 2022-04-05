import express from "express";

import {
  register,
  newUser,
  login,
  updateUser,
  updateUserAdmin,
  deleteUserAdmin,
  allUsers,
} from "../controllers/authController.js";
import authenticateUser, { restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.use(authenticateUser);
router.route("/").patch(updateUser);

router.use(restrictTo("admin"));
router.route("/").get(allUsers).post(newUser);
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
 *           description: auto-generated id of the user
 *         email:
 *           type: string
 *           description: email of the account
 *         password:
 *           type: string
 *           description: The password of the account
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
 *   name: auth
 *   description: all related operations to auth
 */

/**

 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: create new user
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: user created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: please provide all values
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: login user
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: please provide all values
 *       401:
 *         description: invalid credentials
 *
 */

/**
 * @swagger
 * /api/v1/auth/:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: update user account
 *     tags: [auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *
 *     responses:
 *       200:
 *         description: account updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Please provide all values
 */

/**
 * @swagger
 * /api/v1/auth/:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: returns the list of all users
 *     tags: [auth]
 *
 *     responses:
 *       200:
 *         description: the list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/v1/auth/:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: admin create new user
 *     tags: [auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       201:
 *         description: user created
 *       400:
 *         description: please provide all values
 *
 */

/**
 * @swagger
 * /api/v1/auth/{id}:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: admin update the user by id
 *     tags: [auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: user updated
 *       400:
 *         description: Please provide a valid user id
 *       401:
 *         description: you can't update admin account
 *
 */

/**
 * @swagger
 * /api/v1/auth/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Remove the user by id  restricted only to admin
 *     tags: [auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: user deleted
 *       400:
 *         description: Please provide a valid user id
 *       401:
 *         description: you can't delete admin account
 *
 */
