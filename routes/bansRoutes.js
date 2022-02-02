import express from "express";

import {
  banPublication,
  banComment,
  deleteBan,
  getAllBans,
  updateBanPublication,
  updateBanComment,
} from "../controllers/banController.js";

import authenticateUser, { restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);
router.route("publications/:id").post(banPublication);
router.route("comments/:id").post(banComment);

router.use(restrictTo("admin"));

router.route("/").get(getAllBans);
router.route("/:id").delete(deleteBan);
router.route("/publications/:id").patch(updateBanPublication);
router.route("/comments/:id").patch(updateBanComment);

export default router;

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
 *   name: Ban
 *   description: all related operations to Ban
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
 * /api/v1/bans/publications/{id}:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: report ban for publication
 *     tags: [Ban]
 *
 *     responses:
 *       200:
 *         description: your ban is stored
 *       400:
 *         description: this publication is already banned
 *       404:
 *         description: No publication with this id
 */

/**
 * @swagger
 * /api/v1/bans/:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: returns the list of all bans
 *     tags: [Ban]
 *
 *     responses:
 *       200:
 *         description: the list of all bans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Ban'
 */

/**
 * @swagger
 * /api/v1/bans/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Remove a ban
 *     tags: [Ban]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ban id
 *
 *     responses:
 *       200:
 *         description: ban removed
 *       401:
 *         description: Not authorized to access this route
 *       404:
 *         description: No ban with this id
 *
 */

/**
 * @swagger
 * /api/v1/bans/publications/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: update ban by id
 *     tags: [Ban]
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

/**
 * @swagger
 * /api/v1/bans/comments/{id}:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: report ban for Comment
 *     tags: [Ban]
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
 * /api/v1/bans/comments/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: update ban by id
 *     tags: [Ban]
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
