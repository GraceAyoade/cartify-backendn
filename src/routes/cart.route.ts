import express from "express";
import authMiddleware from "../middleware/auth.mw";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cart.controller";

const cartRouter = express.Router();

cartRouter.post("/get", authMiddleware, getUserCart);
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/update", authMiddleware, updateCart);

export default cartRouter;
