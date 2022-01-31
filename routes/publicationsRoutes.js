import express from "express";

import {
  createPublication,
  updatePublication,
  getAllPublications,
  deletePublication,
} from "../controllers/publicationController.js";

import authenticateUser, { restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);

router.route("/").post(createPublication).delete(deletePublication).patch(updatePublication);
router.route("/:id").delete(deletePublication).patch(updatePublication);
router.route("/").get(getAllPublications);

router.use(restrictTo("admin"));
//router.route("/:id").delete(deleteJob).patch(updateJob);

export default router;
