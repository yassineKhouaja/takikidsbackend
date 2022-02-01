import express from "express";

import {
  createPublication,
  myPublication,
  updatePublication,
  getAllPublications,
  deletePublication,
  acceptPublication,
  banPublication,
  updateBanPublication,
  getAllBans,
} from "../controllers/publicationController.js";

import authenticateUser, { restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);
router.route("/myPublication").get(myPublication);
router
  .route("/")
  .get(getAllPublications)
  .post(createPublication)
  .delete(deletePublication)
  .patch(updatePublication);
router.route("/bans/:id").post(banPublication);
router.route("/:id").delete(deletePublication).patch(updatePublication);

router.use(restrictTo("admin"));
router.route("/accept/:id").patch(acceptPublication);

router.route("/bans/allBans").get(getAllBans);
router.route("/bans/:id").patch(updateBanPublication);

export default router;
