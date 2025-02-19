// import Order from "../models/order.model";
// import User from "../models/user.model";
// import { Request, Response, NextFunction } from "express";
// import ErrorResponse from "../utils/errorResponse.utils";
// import paystack from "paystack";

// const paystackInstance = paystack(process.env.PAYSTACK_SECRET_KEY || "");

// // global variables
// const currency = "inr";
// const deliveryCharge = 10;

// // Placing orders using COD Method
// const placeOrder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { userId, items, amount, address, email } = req.body;
//     const orderData = {
//       userId,
//       items,
//       address,
//       amount,
//       email,
//       paymentMethod: "COD",
//       payment: false,
//       date: Date.now(),
//     };
//     const order = new Order(orderData);
//     await order.save();
//     await User.findByIdAndUpdate(userId, { cartData: {} });
//     res
//       .status(200)
//       .json({ error: false, message: "Order placed", data: order });
//   } catch (error) {
//     next(new ErrorResponse("unsuccessful", 400));
//   }
// };

// // Placing orders using Paystack Method
// const placeOrderPaystack = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { userId, items, amount, address, email, orderId } = req.body;
//     const { origin } = req.headers;

//     const orderData = {
//       userId,
//       items,
//       address,
//       amount,
//       email,
//       orderId,
//       paymentMethod: "Paystack",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new Order(orderData);
//     await newOrder.save();

//     // Create a payment request with Paystack
//     const paymentData = {
//       email: email,
//       amount: amount * 100,
//       currency: "NGN",
//       callback_url: `${origin}/verify-paystack?orderId=${newOrder._id}`, // Callback URL
//     };
//     const response = await paystackInstance.transaction.initialize(
//       paymentData as any
//     );
//     if (response.status) {
//       res.json({
//         success: true,
//         authorization_url: response.data.authorization_url,
//       });
//     } else {
//       res.json({ success: false, message: response.message });
//     }
//   } catch (error: any) {
//     console.log(error);
//     return next(new ErrorResponse("Internal server error!", 500));
//   }
// };

// // Verify Paystack
// const verifyPaystack = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { orderId } = req.query;
//   const userId = req.user;
//   try {
//     const response = await paystackInstance.transaction.verify(
//       req.body.reference
//     );
//     if (response.data.status === "success") {
//       await Order.findByIdAndUpdate(orderId, { payment: true });
//       const user = await User.findById(userId);
//       user.cartData = {};
//       await user.save();

//       res.json({ success: true, message: "Payment Successful" });
//     } else {
//       res.json({ success: false, message: "Payment Failed" });
//     }
//   } catch (error) {
//     console.log(error);
//     return next(new ErrorResponse("Internal server error!", 500));
//   }
// };

// // All Orders data for Admin Panel
// const allOrders = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;

//     const [orders, total] = await Promise.all([
//       Order.find({})
//         .sort({ date: -1 })
//         .skip(skip)
//         .limit(limit),
//       Order.countDocuments({})
//     ]);

//     res.status(200).json({
//       error: false,
//       message: "All orders",
//       data: orders,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     next(new ErrorResponse("Failed to fetch orders", 400));
//   }
// };

// // User Order Data For Forntend
// const userOrders = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { userId } = req.body;
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;

//     const [orders, total] = await Promise.all([
//       Order.find({ userId })
//       //   .sort({ date: -1 })
//       //   .skip(skip)
//       //   .limit(limit),
//       // Order.countDocuments({ userId })
//     ]);

//     res.status(200).json({
//       error: false,
//       message: "User orders",
//       data: orders,
//       // pagination: {
//       //   page,
//       //   limit,
//       //   total,
//       //   totalPages: Math.ceil(total / limit)
//       // }
//     });
//   } catch (error) {
//     next(new ErrorResponse("Failed to fetch user orders", 400));
//   }
// };

// // update order status from Admin Panel
// const updateStatus = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { orderId, status } = req.body;

//     await Order.findByIdAndUpdate(orderId, { status });
//     res
//       .status(200)
//       .json({ error: false, message: "Status Updated", data: null });
//   } catch (error) {
//     next(new ErrorResponse("unsuccessful", 400));
//   }
// };

// export {
//   placeOrderPaystack,
//   verifyPaystack,
//   placeOrder,
//   allOrders,
//   userOrders,
//   updateStatus,
// };
