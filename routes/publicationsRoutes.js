import express from "express";

import {
  createPublication,
  updatePublication,
  getAllPublications,
  deletePublication,
  acceptPublication,
  banPublication,
  updateBanPublication,
} from "../controllers/publicationController.js";

import authenticateUser, { restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);

router.route("/").post(createPublication).delete(deletePublication).patch(updatePublication);
router.route("/bans/:id").post(banPublication);
router.route("/:id").delete(deletePublication).patch(updatePublication);
router.route("/").get(getAllPublications);

router.use(restrictTo("admin"));
router.route("/accept/:id").patch(acceptPublication);
router.route("/bans/:id").patch(updateBanPublication);

export default router;
