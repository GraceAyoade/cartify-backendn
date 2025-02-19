import { Router } from "express";
import {
  addReview,
  getAllProductReviews,
  getProductReviews,
} from "../controllers/review.controller";
import authMiddleware from "../middleware/auth.mw";
import { checkRole } from "../middleware/checkRole.mw";

const reviewRouter = Router();

// Route to submit a review
reviewRouter.post("/", authMiddleware, checkRole(["user"]), addReview);

// Route to get reviews for a specific product
reviewRouter.get("/product/:productId", getProductReviews);

// Route to get all product reviews summary
reviewRouter.get("/summary", getAllProductReviews);

export default reviewRouter;
