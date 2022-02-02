import express from "express";

import {
  createPublication,
  myPublication,
  updatePublication,
  getAllPublications,
  deletePublication,
  acceptPublication,
} from "../controllers/publicationController.js";

import authenticateUser, { restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);
router.route("/myPublication").get(myPublication);
router.route("/").get(getAllPublications).post(createPublication);
router.route("/:id").delete(deletePublication).patch(updatePublication);

router.use(restrictTo("admin"));
router.route("/accept/:id").patch(acceptPublication);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Publication:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: auto-generated id of the publication
 *         title:
 *           type: string
 *           description: the title of the publication
 *         description:
 *           type: string
 *           description: the description of the publication
 *         status:
 *           type: string
 *           description: The status of the publication by default open
 *       example:
 *         title: this the title of the publication...
 *         description:  this the description of the publication...
 *         status: open
 */

/**
 * @swagger
 * tags:
 *   name: Publication
 *   description: all related operations to publication
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
 * /api/v1/publication/myPublication:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: returns the list of all my Publications
 *     tags: [Publication]
 *
 *     responses:
 *       200:
 *         description: the list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Publication'
 */

/**
 * @swagger
 * /api/v1/publication/:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: returns the list of all accepted publications of all users
 *     tags: [Publication]
 *
 *     responses:
 *       200:
 *         description: the list of all publications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Publication'
 */

/**
 * @swagger
 * /api/v1/publication/:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: create new publication
 *     tags: [Publication]
 *
 *     responses:
 *       200:
 *         description: the list of all publications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Publication'
 */

/**
 * @swagger
 * /api/v1/publications/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Remove the user by id
 *     tags: [Publication]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Publication id
 *
 *     responses:
 *       200:
 *         description: publication removed
 *       400:
 *         description: Please provide all values
 *       401:
 *         description: Not authorized to access this route
 *       404:
 *         description: No publication with this id
 *
 */

/**
 * @swagger
 * /api/v1/publications/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: update publication by id
 *     tags: [Publication]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Publication'
 *
 *     responses:
 *       200:
 *         description: publication updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Publication'
 *       400:
 *         description: Please provide all values
 *       401:
 *         description: Not authorized to access this route
 *       404:
 *         description: No publication with this id
 */

/**
 * @swagger
 * /api/v1/publications/accept/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: accept publication by admin
 *     tags: [Publication]
 *     responses:
 *       200:
 *         description: publication confirmed
 *       400:
 *         description: this publication is already banned
 *       404:
 *         description: No publication with this id
 */
