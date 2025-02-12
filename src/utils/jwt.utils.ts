import jwt from "jsonwebtoken";

export const createToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", { expiresIn: "2h" });
};

export const regToken = (newUser: any): string => {
  return jwt.sign({ email: newUser.email }, process.env.JWT_SECRET || "", {
    expiresIn: "10m",
  });
};
