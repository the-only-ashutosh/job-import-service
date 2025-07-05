import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI ?? "")
  .then(() => {
    console.log("Worker: MongoDB connected");
    import("./services/worker.js");
    console.log("Worker started and waiting for jobs...");
  })
  .catch((err) => console.error("Worker: MongoDB connection error", err));
