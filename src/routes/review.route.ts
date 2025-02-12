import { Router } from "express";
import { addReview } from "../controllers/review.controller";
import authMiddleware from "../middleware/auth.mw";
import { checkRole } from "../middleware/checkRole.mw";

const reviewRouter = Router();

// Route to submit a review
reviewRouter.post("/reviews", authMiddleware, checkRole(["user"]), addReview);

export default reviewRouter;
