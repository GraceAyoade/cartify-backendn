import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const checkRole = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = await User.findOne({ _id: user }).select("role");

    if (!userRole || !allowedRoles.includes(userRole.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
