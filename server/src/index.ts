import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import Redis from "ioredis";
import cors from "cors";

import importHistoryRoutes from "./routes/importHistory.js";
import { startFetcher } from "./services/fetcher.js";
import { setIO } from "./services/io-helper.js";
import systemInfoRouter from "./routes/systemInfo.js";

dotenv.config({ quiet: true });
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
const sub = new Redis(process.env.REDIS_URL ?? "");

app.use(express.json());
app.use(cors({ origin: "*" }));
app.set("io", io);

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI ?? "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error", err));

// Socket on
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});
setIO(io);
sub.subscribe("import-channel", (err, count) => {
  if (err) console.error("Redis pub/sub subscribe error:", err);
  else console.log("Subscribed to import-channel");
});

sub.subscribe("activity-update", (err, count) => {
  if (err) console.error("Redis pub/sub subscribe error:", err);
  else console.log("Subscribed to activity-update");
});

sub.on("message", (channel, message) => {
  if (channel === "import-channel") {
    io.emit("import-completed", JSON.parse(message));
    io.emit("activity-update", {
      type: "Batch processing completed",
      timestamp: new Date(),
    });
  }
  if (channel === "activity-update") {
    io.emit("activity-update", JSON.parse(message));
  }
});

// Routes
app.use("/api/import-history", importHistoryRoutes);
app.use("/api/system-info", systemInfoRouter);

// Start job fetcher cron
startFetcher();

const PORT = process.env.PORT ?? 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
