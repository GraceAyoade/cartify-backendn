import express from "express";
import {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  placeOrderPaystack,
  verifyPaystack,
} from "../controllers/order.controller";
import authMiddleware from "../middleware/auth.mw";
import { checkRole } from "../middleware/checkRole.mw";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", authMiddleware, checkRole(["admin"]), allOrders);
orderRouter.post("/status", authMiddleware, checkRole(["admin"]), updateStatus);

// Payment Features
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/paystack", authMiddleware, placeOrderPaystack);

// User Feature
orderRouter.post("/userorders", authMiddleware, userOrders);

// verify payment
orderRouter.post("/verify-paystack", authMiddleware, verifyPaystack);

export default orderRouter;
