import express from "express";
import dotenv from "dotenv";

import { connectionDB } from "./DB/connection.js";
import authRouter from "./src/modules/auth/authRouter.js";
import categoryRouter from "./src/modules/category/categoryRouter.js";
import subcategoryRouter from "./src/modules/subCategory/subCategoryRouter.js";
import brandRouter from "./src/modules/brand/brandRouter.js";
import couponRouter from "./src/modules/coupon/couponRouter.js";
import productRouter from "./src/modules/product/productRouter.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

//parsing
app.use(express.json());
//DB Connection
await connectionDB();

//APIs
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", subcategoryRouter);
app.use("/brand", brandRouter);
app.use("/coupon", couponRouter);
app.use("/product", productRouter);

//page not found handler
app.all("*", (req, res, next) => {
  return next(new Error("page not found", { cause: 404 }));
});

//global error handler
app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
});

app.listen(port, () => console.log(`app is running on port ${port}`));
