import express from "express";
import { addStyle, getStyles } from "../controllers/StyleController.js";

const router = express.Router();
router.route("/").post(addStyle);
router.route("/:id").get(getStyles);

export default router;
