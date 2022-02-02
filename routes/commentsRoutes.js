import express from "express";

import { createComment, deleteComment, updateComment } from "../controllers/CommentController.js";

import authenticateUser, { restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);

router.route("/:id").post(createComment).patch(updateComment).delete(deleteComment);

router.use(restrictTo("admin"));

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
