import express from "express";
import dotenv from "dotenv";
import connectDB from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cookieParser());

// public routes
app.use("/api/auth", authRoute);
// private routes
app.use(protectedRoute); // middleware xác minh user trước khi vào route
app.use("/api/users", userRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
