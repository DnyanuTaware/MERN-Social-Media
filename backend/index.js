import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.Cloudinary_CLOUD_NAME,

  api_key: process.env.Cloudinary_API,

  api_secret: process.env.Cloudinary_SECRET,
});

const app = express();
app.get("/", (req, res, next) => {
  res.send("Server Running");
});

//importing routes
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

//using middlewares
app.use(express.json());
app.use(methodOverride("_method"));

app.use(methodOverride("_method")); //nable method override
app.use(express.urlencoded({ extended: true })); //parse data
app.use(cookieParser());
//using routes
app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
  connectDb();
});
