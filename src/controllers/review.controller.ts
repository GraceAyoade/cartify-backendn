import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse.utils";
import Review from "../models/review.model";

const addReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, userId, rating, reviewText } = req.body;

    if (!productId || !userId || !rating || !reviewText) {
       res.status(400).json({ error: true, message: "All fields are required", data: null });
    }

    const review = new Review({ productId, userId, rating, reviewText });
    await review.save();

    res.status(201).json({
      error: false,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    return next(new ErrorResponse("Internal server error!", 500));
  }
};

export { addReview };
