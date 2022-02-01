import express from "express";

import { createComment, deleteComment, updateComment } from "../controllers/CommentController.js";

import authenticateUser, { restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);

router.route("/:id").post(createComment).patch(updateComment).delete(deleteComment);

router.use(restrictTo("admin"));
//router.route("/:id").delete(deleteJob).patch(updateJob);

export default router;