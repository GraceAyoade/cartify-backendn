import mongoose from "mongoose";
import { IProduct } from "../types/types";

const ProductSchema = new mongoose.Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String},
    subCategory: { type: String },
    sizes: { type: Array },
    color: { type: Array },
    bestseller: { type: Boolean },
    date: { type: Number, required: true }
})

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;