// router/details.js
import express from "express";
import { CreateDetails, getDetails } from "../controllers/DetailsController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();
router.post("/create", isAuthenticated, CreateDetails);
router.get("/get",  getDetails);

export default router;