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
router.route("/bans/:id").post(banComment);

router.route("/:id").post(createComment).patch(updateComment).delete(deleteComment);

router.use(restrictTo("admin"));
router.route("/bans/allBans").get(getAllBans);
router.route("/bans/:id").patch(updateBanComment);

export default router;
