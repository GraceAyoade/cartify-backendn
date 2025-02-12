import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb";
import connectCloudinary from "./config/cloudinary";
import userRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";
import orderRouter from "./routes/order.route";
import seedData from "./data/seed";
import reviewRouter from "./routes/review.route";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(cors() as express.RequestHandler);
app.use(express.json({ limit: "50mb" }) as express.RequestHandler);
app.use(express.urlencoded({ extended: true, limit: "50mb" }) as express.RequestHandler);

connectDB();
connectCloudinary();
seedData();

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT : " + port));
