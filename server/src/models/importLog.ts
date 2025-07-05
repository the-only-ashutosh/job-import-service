import mongoose from "mongoose";
const importLogSchema = new mongoose.Schema(
  {
    fileName: String,
    importDateTime: Date,
    totalFetched: Number,
    totalImported: Number,
    newJobs: Number,
    updatedJobs: Number,
    failedJobs: [{ jobId: String, reason: String }],
    status: {
      type: String,
      enum: ["success", "failed", "partial"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ImportLog", importLogSchema);
