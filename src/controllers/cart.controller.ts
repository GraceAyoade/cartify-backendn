import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import ErrorResponse from "../utils/errorResponse.utils";

// add products to user cart
const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, itemId, size } = req.body;

    const userData = await User.findById(userId);
    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await User.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({
      error: false,
      message: "Product added to cart successfully",
      data: cartData,});
  } catch (error) {
    return next(new ErrorResponse("Internal server error!", 500));
  }
};

// update user cart
const updateCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await User.findById(userId);
    let cartData = await userData.cartData;
    cartData[itemId][size] = quantity;
    await User.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({
      error: false,
      message: "Product updated in cart successfully",
      data: cartData,
    });
  } catch (error) {
    return next(new ErrorResponse("Internal server error!", 500));
  }
};

// get user cart data
const getUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.body;

    const userData = await User.findById(userId);
    let cartData = await userData.cartData;
    res.status(200).json({
      error: false,
      message: "Product gotten successfully",
      data: cartData,
    });
  } catch (error) {
    return next(new ErrorResponse("Internal server error!", 500));
  }
};

export { addToCart, updateCart, getUserCart };
