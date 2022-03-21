import express from "express";
import { addType, getAllTypes } from "../controllers/TypeController.js";

const router = express.Router();
router.route("/").get(getAllTypes).post(addType);

export default router;
