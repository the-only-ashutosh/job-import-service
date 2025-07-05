import mongoose from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, unique: true },
    title: String,
    description: String,
    link: String,
    author: String,
    pubDate: Date,
    guid: String,
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
