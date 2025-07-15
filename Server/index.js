import express from "express";
const app = express();

import userRoutes from "./routes/User.js";
import profileRoutes from "./routes/Profile.js";
import paymentRoutes from "./routes/Payment.js";
import courseRoutes from "./routes/Course.js";

import { connect } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { razorpay } from "./config/razorpay.js";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

const PORT = process.env.PORT || 5000;
dotenv.config();


// database connection
connect();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
    credentials: true,
}));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// cloudinary connection

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);


// default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the server",
  });
});


app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});



