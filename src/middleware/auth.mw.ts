import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: true, message: "Access Denied", data: null });
  }

  try {
    const token_decode: any = jwt.verify(token, process.env.JWT_SECRET || "");
    req.body.userId = token_decode.id;
    req.user = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;
