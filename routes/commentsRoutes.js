import express from "express";

import {
  createComment,
  deleteComment,
  updateComment,
  banComment,
  updateBanComment,
  getAllBans,
} from "../controllers/CommentController.js";

import authenticateUser, { restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);

router.route("/:id").post(createComment).patch(updateComment).delete(deleteComment);
router.route("/bans/:id").post(banComment);

router.use(restrictTo("admin"));
router.route("/bans/allBans").get(getAllBans);
router.route("/bans/:id").patch(updateBanComment);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: auto-generated id of the commentaire
 *         content:
 *           type: string
 *           description: the content of the Comment
 *         status:
 *           type: string
 *           description: The status of the Comment by default open
 *         user:
 *           type: string
 *           description: the user id who create the Comment
 *         publication:
 *           type: string
 *           description: the publication id which the Comment related
 *       example:
 *         content: this a Comment...
 *         status: open
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ban:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: auto-generated id of the ban
 *         bannedBy:
 *           type: string
 *           description: the user id who bans the publication
 *         status:
 *           type: string
 *           description: The status of the ban by default pending
 */

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: all related operations to Comment
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
 * /api/v1/comments/{id}:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: create new comment
 *     tags: [Comment]
 *     responses:
 *       200:
 *         description: comment created
 *       400:
 *         description: Please provide content
 *       404:
 *         description: this publication is not open for comments
 */

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: update comment by id
 *     tags: [Comment]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Comment'
 *
 *     responses:
 *       200:
 *         description: comment updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Please provide content
 *       401:
 *         description: Not authorized to access this route
 *       404:
 *         description: No comment with this id
 */

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Remove the comment by id
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *
 *     responses:
 *       200:
 *         description: comment removed
 *       401:
 *         description: Not authorized to access this route
 *       404:
 *         description: No comment with this id
 *
 */

/**
 * @swagger
 * /api/v1/comments/bans/{id}:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: report ban for Comment
 *     tags: [Comment]
 *
 *     responses:
 *       200:
 *         description: your ban is stored
 *       400:
 *         description: this comment is already banned
 *       404:
 *         description: No comment with this id
 */

/**
 * @swagger
 * /api/v1/comments/bans/allBans:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: returns the list of all bans of comments
 *     tags: [Comment]
 *
 *     responses:
 *       200:
 *         description: the list of all bans of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Ban'
 */

/**
 * @swagger
 * /api/v1/comments/bans/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: update ban by id
 *     tags: [Comment]
 *     requestBody:
 *      required: true
 *     responses:
 *       200:
 *         description: ban updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Ban'
 *       400:
 *         description: Please provide a status
 *       404:
 *         description: No ban with this id
 */
