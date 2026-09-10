import express from "express";
import { createReview, getReviewsByCar } from "../controllers/reviewController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const reviewRoutes = express.Router();

reviewRoutes.post("/:carId", authenticate, createReview);
reviewRoutes.get("/:carId", getReviewsByCar);
export default reviewRoutes;