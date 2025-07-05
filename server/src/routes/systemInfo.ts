import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/job.js";

dotenv.config({ quiet: true });

const systemInfoRouter = express.Router();
const startTime = Date.now();
const formatUptime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
};

systemInfoRouter.get("/", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState; // 1 = connected
    const totalJobs = await Job.estimatedDocumentCount();
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    res.json({
      apiVersion: process.env.API_VERSION as string,
      dbStatus: dbState === 1 ? "Connected" : "Disconnected",
      totalRecords: totalJobs,
      uptime: formatUptime(uptimeSeconds),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get system info" });
  }
});

export default systemInfoRouter;
