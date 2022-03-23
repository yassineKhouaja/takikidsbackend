import express from "express";
import { addConfig, getConfig } from "../controllers/configController.js";

const router = express.Router();
router.route("/:id").get(getConfig);
router.route("/").post(addConfig);

// router.route("/myPublication").get(myPublication);
// router.route("/").get(getAllPublications).post(createPublication);
// router.route("/:id").delete(deletePublication).patch(updatePublication);

export default router;
