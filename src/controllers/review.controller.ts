import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse.utils";
import Review from "../models/review.model";

const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, userId, rating, reviewText } = req.body;
    if (!productId || !userId || !rating || !reviewText) {
      res
        .status(400)
        .json({ error: true, message: "All fields are required", data: null });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      res.status(400).json({
        error: true,
        message: "You have already reviewed this product",
        data: null,
      });
    }

    const review = new Review({ productId, userId, rating, reviewText });
    await review.save();
    res.status(201).json({
      error: false,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    next(new ErrorResponse("Internal server error!", 500));
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    if (!productId) {
      res
        .status(400)
        .json({ error: true, message: "Product ID is required", data: null });
    }
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .populate("userId", "name");

    const reviewCount = reviews.length;
    const latestRating = reviews.length > 0 ? reviews[0].rating : null;
    res.status(200).json({
      error: false,
      message: "Reviews fetched successfully",
      data: {
        reviews,
        reviewCount,
        latestRating,
      },
    });
  } catch (error) {
    next(new ErrorResponse("Internal server error!", 500));
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

const getAllProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviews = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          reviewCount: { $sum: 1 },
          latestRating: { $first: "$rating" },
        },
      },
      {
        $project: {
          productId: "$_id",
          reviewCount: 1,
          latestRating: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      error: false,
      message: "All product reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    next(new ErrorResponse("Internal server error!", 500));
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export { addReview, getProductReviews, getAllProductReviews };
