import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import studentRoutes from "./src/routes/student.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/studentDB";

app.use(
  cors({
    origin: [
      "http://localhost:5173"

    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/upload", uploadRoutes);

console.log("MONGODB_URI check:", process.env.MONGODB_URI);
// Database connection

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get("/", (req, res) => {
  res.send("Server is connected");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
