import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse.utils";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.model";

// function for add product
const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      colors,
      quantity,
      bestseller,
    } = req.body;

    if (!req.files) {
      res
        .status(400)
        .json({ error: true, message: "All images are required", data: null });
    }

    const img = req.files as {
      image1: Express.Multer.File[];
      image2: Express.Multer.File[];
      image3: Express.Multer.File[];
      image4: Express.Multer.File[];
    };

    const images = [
      img.image1 && img.image1[0],
      img.image2 && img.image2[0],
      img.image3 && img.image3[0],
      img.image4 && img.image4[0],
    ].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller?.trim() === "true" ? true : false,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      quantity: Number(quantity),
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new Product(productData);
    await product.save();
    res.status(200).json({
      error: false,
      message: "Product added successfully",
      data: null,
    });
  } catch (error) {
    return next(new ErrorResponse("Internal server error!", 500));
  }
};

// function for list product
const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find({});
    res
      .status(200)
      .json({ error: false, message: "product list found!", data: products });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse("Internal server error!", 500));
  }
};

// function for removing product
const removeProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Product.findByIdAndDelete(req.body.id);
    res.status(200).json({
      error: false,
      message: "product removed successfully!",
      data: null,
    });
  } catch (error) {
    return next(new ErrorResponse("Internal server error!", 500));
  }
};

// function for single product info
const singleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    res
      .status(200)
      .json({ error: false, message: "product info found", data: product });
  } catch (error) {
    return next(new ErrorResponse("product info not found!", 404));
  }
};

// function for updating product
const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      id,
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      colors,
      quantity,
      bestseller,
    } = req.body;

    // Validate request
    if (!id) {
      res
        .status(400)
        .json({ error: true, message: "Product ID is required", data: null });
    }

    const updateData: any = {
      name,
      description,
      price: price ? Number(price) : undefined,
      category,
      subCategory,
      bestseller: bestseller?.trim() === "true" ? true : false,
      sizes: sizes ? JSON.parse(sizes) : undefined,
      colors: colors ? JSON.parse(colors) : undefined,
      quantity: quantity ? Number(price) : undefined,
    };

    // Remove undefined properties
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product) {
      res
        .status(404)
        .json({ error: true, message: "Product not found", data: null });
    }
    res
      .status(200)
      .json({
        error: false,
        message: "Product updated successfully",
        data: product,
      });
  } catch (error) {
    return next(new ErrorResponse("Internal server error!", 500));
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct,
};
