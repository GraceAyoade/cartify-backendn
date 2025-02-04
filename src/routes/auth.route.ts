import express from "express";
import {
  loginUser,
  registerUser,
  verifyEmail,
} from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/verify-email/:token", verifyEmail);

export default authRouter;
