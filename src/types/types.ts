import { ObjectId, Types } from "mongoose";

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  nationality?: string;
  address?: string;
  cartData: Object | any;
  role: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  sizes?: [];
  colors?: [];
  bestseller: boolean;
  quantity: number;
  image: any;
  date: number;
}

export interface IOrder {
  userId: string;
  items: any;
  amount: number;
  address: ObjectId;
  status: string;
  paymentMethod: string;
  payment: boolean;
  date: number;
}

export interface IMailOptions {
  message?: string;
  subject: string;
  email: string;
  html?: string;
}
