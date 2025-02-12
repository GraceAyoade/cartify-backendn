import express from "express";
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct,
} from "../controllers/product.controller";
import authMiddleware from './../middleware/auth.mw';
import { checkRole } from "../middleware/checkRole.mw";
import upload from "../middleware/multer";

const productRouter = express.Router();

productRouter.post(
  "/add",
  authMiddleware,
  checkRole(["admin"]),
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.post("/remove", authMiddleware, checkRole(["admin"]), removeProduct);
productRouter.get("/single", singleProduct);
productRouter.get("/list", listProducts);
productRouter.put("/list", updateProduct);


export default productRouter;
