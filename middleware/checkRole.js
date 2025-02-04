import userModel from "../models/userModel.js";

export const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = await userModel.findOne({ _id: user }).select("role");

    if (!userRole || !allowedRoles.includes(userRole.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
